import React from 'react';
import { apiService, BookingResponse } from "../services/apiService.ts";
import { useAuth } from "../components/AuthContext.tsx";
import {
    Card,
    CardBody,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Spinner,
    Tabs,
    Tab
} from '@nextui-org/react';
import {
    Calendar,
    Mail,
    Phone,
    User,
    CheckCircle,
    MessageSquare,
    AlertTriangle
} from 'lucide-react';

const AdminBookingsPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [bookings, setBookings] = React.useState<BookingResponse[]>([]);
    const [upcomingBookings, setUpcomingBookings] = React.useState<BookingResponse[]>([]);
    const [unconfirmedBookings, setUnconfirmedBookings] = React.useState<BookingResponse[]>([]);
    const [selectedBooking, setSelectedBooking] = React.useState<BookingResponse | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [actionLoading, setActionLoading] = React.useState<string | null>(null);

    // Check if user is admin
    if (!isAuthenticated || !user?.isAdmin) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Card>
                    <CardBody className="text-center py-12">
                        <AlertTriangle className="mx-auto mb-4 text-warning" size={48} />
                        <h2 className="text-xl font-semibold mb-2">Acces restricționat</h2>
                        <p className="text-default-600">
                            Nu aveți permisiunea de a accesa această pagină.
                            Doar administratorii pot vizualiza programările.
                        </p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const serviceLabels: Record<string, string> = {
        'initial': 'Consult Nutrițional Inițial',
        'followup': 'Consult de Urmărire',
        'mealplan': 'Plan Alimentar Personalizat',
        'sport': 'Program de Nutriție Sportivă',
    };

    const loadBookings = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [upcoming, unconfirmed] = await Promise.all([
                apiService.getUpcomingBookings(),
                apiService.getUnconfirmedBookings()
            ]);

            setUpcomingBookings(upcoming);
            setUnconfirmedBookings(unconfirmed);

            // Combine all bookings for the "All" tab, avoiding duplicates
            const allBookingsMap = new Map();
            [...upcoming, ...unconfirmed].forEach(booking => {
                allBookingsMap.set(booking.id, booking);
            });
            setBookings(Array.from(allBookingsMap.values()));

        } catch (err: any) {
            console.error('Error loading bookings:', err);
            setError('Nu s-au putut încărca programările. Te rugăm să încerci din nou.');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        loadBookings();
    }, []);

    const handleConfirmBooking = async (bookingId: string) => {
        try {
            setActionLoading(bookingId);
            await apiService.confirmBooking(bookingId);
            await loadBookings(); // Reload bookings
        } catch (err: any) {
            console.error('Error confirming booking:', err);
            setError('Nu s-a putut confirma programarea.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        try {
            setActionLoading(bookingId);
            await apiService.cancelBooking(bookingId);
            await loadBookings(); // Reload bookings
            onClose(); // Close modal if open
        } catch (err: any) {
            console.error('Error canceling booking:', err);
            setError('Nu s-a putut anula programarea.');
        } finally {
            setActionLoading(null);
        }
    };

    const openBookingDetails = (booking: BookingResponse) => {
        setSelectedBooking(booking);
        onOpen();
    };

    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString('ro-RO'),
            time: date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getStatusColor = (confirmed: boolean) => {
        return confirmed ? 'success' : 'warning';
    };

    const getStatusText = (confirmed: boolean) => {
        return confirmed ? 'Confirmată' : 'În așteptare';
    };

    const renderBookingTable = (bookingsList: BookingResponse[]) => (
        <Table aria-label="Bookings table">
            <TableHeader>
                <TableColumn>PACIENT</TableColumn>
                <TableColumn>SERVICIU</TableColumn>
                <TableColumn>DATA & ORA</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACȚIUNI</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Nu există programări">
                {bookingsList.map((booking) => {
                    const dateTime = formatDateTime(booking.dateTime);
                    return (
                        <TableRow key={booking.id}>
                            <TableCell>
                                <div>
                                    <p className="font-medium">{booking.name}</p>
                                    <p className="text-sm text-default-500">{booking.email}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p className="text-sm">
                                    {serviceLabels[booking.service] || booking.service}
                                </p>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p className="font-medium">{dateTime.date}</p>
                                    <p className="text-sm text-default-500">{dateTime.time}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    color={getStatusColor(booking.confirmed)}
                                    variant="flat"
                                    size="sm"
                                >
                                    {getStatusText(booking.confirmed)}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="light"
                                        onPress={() => openBookingDetails(booking)}
                                    >
                                        Detalii
                                    </Button>
                                    {!booking.confirmed && (
                                        <Button
                                            size="sm"
                                            color="success"
                                            variant="flat"
                                            isLoading={actionLoading === booking.id}
                                            onPress={() => handleConfirmBooking(booking.id)}
                                        >
                                            Confirmă
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="light"
                                        isLoading={actionLoading === booking.id}
                                        onPress={() => handleCancelBooking(booking.id)}
                                    >
                                        Anulează
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Card>
                    <CardBody className="text-center py-12">
                        <Spinner size="lg" />
                        <p className="mt-4">Se încarcă programările...</p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Gestionare Programări</h1>
                <p className="text-default-600">
                    Vizualizează și gestionează toate programările pentru consultații
                </p>
            </div>

            {error && (
                <Card className="mb-4">
                    <CardBody>
                        <div className="p-4 bg-danger-100 text-danger-700 rounded-lg">
                            {error}
                            <Button
                                size="sm"
                                color="danger"
                                variant="light"
                                className="ml-2"
                                onPress={() => setError(null)}
                            >
                                Închide
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardBody className="text-center">
                        <Calendar className="mx-auto mb-2 text-primary" size={24} />
                        <p className="text-2xl font-bold">{bookings.length}</p>
                        <p className="text-sm text-default-600">Total programări</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="text-center">
                        <CheckCircle className="mx-auto mb-2 text-success" size={24} />
                        <p className="text-2xl font-bold">
                            {bookings.filter(b => b.confirmed).length}
                        </p>
                        <p className="text-sm text-default-600">Confirmate</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="text-center">
                        <AlertTriangle className="mx-auto mb-2 text-warning" size={24} />
                        <p className="text-2xl font-bold">{unconfirmedBookings.length}</p>
                        <p className="text-sm text-default-600">În așteptare</p>
                    </CardBody>
                </Card>
            </div>

            {/* Bookings Tabs */}
            <Card>
                <CardBody>
                    <Tabs aria-label="Bookings tabs" className="w-full">
                        <Tab key="all" title={`Toate (${bookings.length})`}>
                            {renderBookingTable(bookings)}
                        </Tab>
                        <Tab key="upcoming" title={`Următoarele (${upcomingBookings.length})`}>
                            {renderBookingTable(upcomingBookings)}
                        </Tab>
                        <Tab key="unconfirmed" title={`Neconfirmate (${unconfirmedBookings.length})`}>
                            {renderBookingTable(unconfirmedBookings)}
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>

            {/* Booking Details Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalContent>
                    {selectedBooking && (
                        <>
                            <ModalHeader>
                                <h3 className="text-xl">Detalii programare</h3>
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <User className="text-default-400" size={20} />
                                            <div>
                                                <p className="text-sm text-default-600">Nume</p>
                                                <p className="font-medium">{selectedBooking.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="text-default-400" size={20} />
                                            <div>
                                                <p className="text-sm text-default-600">Email</p>
                                                <p className="font-medium">{selectedBooking.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="text-default-400" size={20} />
                                            <div>
                                                <p className="text-sm text-default-600">Telefon</p>
                                                <p className="font-medium">{selectedBooking.phone || 'Nu a fost furnizat'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="text-default-400" size={20} />
                                            <div>
                                                <p className="text-sm text-default-600">Data și ora</p>
                                                <p className="font-medium">
                                                    {formatDateTime(selectedBooking.dateTime).date} la {formatDateTime(selectedBooking.dateTime).time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-default-600 mb-1">Serviciu</p>
                                        <p className="font-medium">
                                            {serviceLabels[selectedBooking.service] || selectedBooking.service}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-default-600 mb-1">Status</p>
                                        <Chip
                                            color={getStatusColor(selectedBooking.confirmed)}
                                            variant="flat"
                                        >
                                            {getStatusText(selectedBooking.confirmed)}
                                        </Chip>
                                    </div>

                                    {selectedBooking.message && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageSquare className="text-default-400" size={20} />
                                                <p className="text-sm text-default-600">Mesaj suplimentar</p>
                                            </div>
                                            <div className="bg-default-100 p-3 rounded-lg">
                                                <p className="text-sm">{selectedBooking.message}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm text-default-600 mb-1">Creat la</p>
                                        <p className="text-sm">
                                            {new Date(selectedBooking.createdAt).toLocaleString('ro-RO')}
                                        </p>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    Închide
                                </Button>
                                {!selectedBooking.confirmed && (
                                    <Button
                                        color="success"
                                        isLoading={actionLoading === selectedBooking.id}
                                        onPress={() => handleConfirmBooking(selectedBooking.id)}
                                    >
                                        Confirmă programarea
                                    </Button>
                                )}
                                <Button
                                    color="danger"
                                    variant="light"
                                    isLoading={actionLoading === selectedBooking.id}
                                    onPress={() => handleCancelBooking(selectedBooking.id)}
                                >
                                    Anulează programarea
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default AdminBookingsPage;