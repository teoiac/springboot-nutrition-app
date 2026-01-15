import React, { useEffect, useState } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Card,
    CardHeader,
    CardBody,
    Button,
    Chip,
    Pagination,
    Tooltip,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from '@nextui-org/react';
import { Mail, MailOpen, Eye } from 'lucide-react';
import { apiService, ContactResponse } from '../services/apiService.ts';
import { useAuth } from '../components/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const ContactMessagesPage: React.FC = () => {
    const { isAdmin, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ContactResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [unreadCount, setUnreadCount] = useState(0);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedMessage, setSelectedMessage] = useState<ContactResponse | null>(null);

    const rowsPerPage = 10;

    useEffect(() => {
        if (!authLoading && !isAdmin) {
            navigate('/');
        }
    }, [authLoading, isAdmin, navigate]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const [messagesResponse, countResponse] = await Promise.all([
                    apiService.getContactMessages(),
                    apiService.countUnreadMessages()
                ]);

                setMessages(messagesResponse);
                setUnreadCount(countResponse);
                setTotalPages(Math.ceil(messagesResponse.length / rowsPerPage));
                setError(null);
            } catch (err) {
                setError('Failed to load messages. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchMessages();
        }
    }, [isAdmin]);

    const handleMarkAsRead = async (id: string) => {
        try {
            const updatedMessage = await apiService.markMessageAsRead(id);
            setMessages(prev => prev.map(msg =>
                msg.id === id ? updatedMessage : msg
            ));
            setUnreadCount(prev => prev - 1);
        } catch (err) {
            setError('Failed to mark message as read');
        }
    };

    const handleViewMessage = (message: ContactResponse) => {
        setSelectedMessage(message);
        if (!message.isRead) {
            handleMarkAsRead(message.id);
        }
        onOpen();
    };

    const paginatedMessages = messages.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    if (authLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Card className="mb-6">
                <CardHeader className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Contact Messages</h1>
                    {unreadCount > 0 && (<Chip color="primary" variant="flat">
                        {unreadCount} unread
                    </Chip>)}
                </CardHeader>
                <CardBody>
                    {error && (
                        <div className="mb-4 p-4 bg-danger-100 text-danger-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Table aria-label="Contact messages table">
                        <TableHeader>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>EMAIL</TableColumn>
                            <TableColumn>DATE</TableColumn>
                            <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody
                            isLoading={loading}
                            loadingContent="Loading messages..."
                            emptyContent={!loading && "No messages found"}
                        >
                            {paginatedMessages.map((message) => (
                                <TableRow key={message.id}>
                                    <TableCell>
                                        {message.isRead ? (
                                            <MailOpen className="text-default-400" size={18} />
                                        ) : (
                                            <Mail className="text-primary" size={18} />
                                        )}
                                    </TableCell>
                                    <TableCell>{message.name}</TableCell>
                                    <TableCell>
                                        <a
                                            href={`mailto:${message.email}`}
                                            className="text-primary hover:underline"
                                        >
                                            {message.email}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(message.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Tooltip content="View message">
                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    size="sm"
                                                    onPress={() => handleViewMessage(message)}
                                                >
                                                    <Eye size={18} />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <Pagination
                                page={page}
                                total={totalPages}
                                onChange={setPage}
                                showControls
                            />
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Message Detail Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Message from {selectedMessage?.name}
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-default-500">Email</p>
                                        <p>
                                            <a
                                                href={`mailto:${selectedMessage?.email}`}
                                                className="text-primary hover:underline"
                                            >
                                                {selectedMessage?.email}
                                            </a>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Date</p>
                                        <p>
                                            {selectedMessage &&
                                                new Date(selectedMessage.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Message</p>
                                        <p className="whitespace-pre-line">
                                            {selectedMessage?.message}
                                        </p>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ContactMessagesPage;