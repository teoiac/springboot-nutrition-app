import React from 'react';
import { apiService, BookingResponse } from "../services/apiService.ts";
import { useAuth } from "../components/AuthContext.tsx";
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Chip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Spinner,
    Divider,
    Input
} from '@nextui-org/react';
import {
    Calendar,
    Clock,
    Mail,
    Phone,
    User,
    CheckCircle,
    MessageSquare,
    AlertTriangle,
    CalendarDays,
    Search,
    RefreshCw
} from 'lucide-react';

const UserAppointmentsPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [appointments, setAppointments] = React.useState<BookingResponse[]>([]);
    const [selectedAppointment, setSelectedAppointment] = React.useState<BookingResponse | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchEmail, setSearchEmail] = React.useState('');
    const [isSearching, setIsSearching] = React.useState(false);

    // Check if user is authenticated
    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Card>
                    <CardBody className="text-center py-12">
                        <User className="mx-auto mb-4 text-warning" size={48} />
                        <h2 className="text-xl font-semibold mb-2">Autentificare necesară</h2>
                        <p className="text-default-600 mb-4">
                            Trebuie să fiți autentificat pentru a vă vedea programările.
                        </p>
                        <Button color="primary" onClick={() => window.location.href = '/login'}>
                            Autentifică-te
                        </Button>
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

    const loadAppointments = async () => {
        if (!user?.email) return;

        try {
            setIsLoading(true);
            setError(null);

            const userAppointments = await apiService.getBookingsByEmail(user.email);
            setAppointments(userAppointments.sort((a, b) =>
                new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
            ));

        } catch (err: any) {
            console.error('Error loading appointments:', err);
            setError('Nu s-au putut încărca programările. Te rugăm să încerci din nou.');
        } finally {
            setIsLoading(false);
        }
    };

    const searchByEmail = async () => {
        if (!searchEmail.trim()) {
            setError('Te rugăm să introduci o adresă de email.');
            return;
        }

        try {
            setIsSearching(true);
            setError(null);

            const userAppointments = await apiService.getBookingsByEmail(searchEmail.trim());
            setAppointments(userAppointments.sort((a, b) =>
                new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
            ));

        } catch (err: any) {
            console.error('Error searching appointments:', err);
            setError('Nu s-au găsit programări pentru această adresă de email.');
        } finally {
            setIsSearching(false);
        }
    };

    React.useEffect(() => {
        if (user?.email) {
            setSearchEmail(user.email);
            loadAppointments();
        }
    }, [user]);

    const openAppointmentDetails = (appointment: BookingResponse) => {
        setSelectedAppointment(appointment);
        onOpen();
    };

    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString('ro-RO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
            shortDate: date.toLocaleDateString('ro-RO'),
            isPast: date < new Date()
        };
    };

    const getStatusColor = (appointment: BookingResponse) => {
        const { isPast } = formatDateTime(appointment.dateTime);

        if (isPast) return 'default';
        if (appointment.confirmed) return 'success';
        return 'warning';
    };

    const getStatusText = (appointment: BookingResponse) => {
        const { isPast } = formatDateTime(appointment.dateTime);

        if (isPast) return 'Finalizată';
        if (appointment.confirmed) return 'Confirmată';
        return 'În așteptare';
    };

    const getStatusIcon = (appointment: BookingResponse) => {
        const { isPast } = formatDateTime(appointment.dateTime);

        if (isPast) return <CheckCircle size={16} />;
        if (appointment.confirmed) return <CheckCircle size={16} />;
        return <Clock size={16} />;
    };

    const upcomingAppointments = appointments.filter(apt =>
        new Date(apt.dateTime) > new Date()
    );
    const pastAppointments = appointments.filter(apt =>
        new Date(apt.dateTime) <= new Date()
    );

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Programările mele</h1>
                <p className="text-default-600">
                    Vizualizează statusul și istoricul consultațiilor tale
                </p>
            </div>

            {/* Search Section */}
            <Card className="mb-6">
                <CardBody>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                            label="Caută după email"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            variant="bordered"
                            startContent={<Search className="text-default-400" size={18} />}
                            placeholder="exemplu@email.com"
                            className="flex-1"
                        />
                        <div className="flex gap-2">
                            <Button
                                color="primary"
                                isLoading={isSearching}
                                onPress={searchByEmail}
                                startContent={!isSearching && <Search size={18} />}
                            >
                                Caută
                            </Button>
                            <Button
                                variant="bordered"
                                onPress={loadAppointments}
                                startContent={<RefreshCw size={18} />}
                            >
                                Reîmprospătează
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {error && (
                <Card className="mb-6">
                    <CardBody>
                        <div className="p-4 bg-danger-100 text-danger-700 rounded-lg flex items-center justify-between">
                            <span>{error}</span>
                            <Button
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => setError(null)}
                            >
                                Închide
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {appointments.length === 0 ? (
                <Card>
                    <CardBody className="text-center py-12">
                        <CalendarDays className="mx-auto mb-4 text-default-300" size={48} />
                        <h3 className="text-lg font-semibold mb-2">Nu ai programări</h3>
                        <p className="text-default-600 mb-4">
                            Nu ai încă nicio programare înregistrată pentru această adresă de email.
                        </p>
                        <Button
                            color="primary"
                            onClick={() => window.location.href = '/booking'}
                        >
                            Programează o consultație
                        </Button>
                    </CardBody>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Upcoming Appointments */}
                    {upcomingAppointments.length > 0 && (
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold">Programări viitoare</h2>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                {upcomingAppointments.map((appointment) => {
                                    const dateTime = formatDateTime(appointment.dateTime);
                                    return (
                                        <div key={appointment.id} className="border rounded-lg p-4 hover:bg-default-50 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold">
                                                            {serviceLabels[appointment.service] || appointment.service}
                                                        </h3>
                                                        <Chip
                                                            color={getStatusColor(appointment)}
                                                            variant="flat"
                                                            size="sm"
                                                            startContent={getStatusIcon(appointment)}
                                                        >
                                                            {getStatusText(appointment)}
                                                        </Chip>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-default-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {dateTime.shortDate}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {dateTime.time}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="bordered"
                                                    onPress={() => openAppointmentDetails(appointment)}
                                                >
                                                    Vezi detalii
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardBody>
                        </Card>
                    )}

                    {/* Past Appointments */}
                    {pastAppointments.length > 0 && (
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold">Istoric programări</h2>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                {pastAppointments.map((appointment) => {
                                    const dateTime = formatDateTime(appointment.dateTime);
                                    return (
                                        <div key={appointment.id} className="border rounded-lg p-4 opacity-75">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold">
                                                            {serviceLabels[appointment.service] || appointment.service}
                                                        </h3>
                                                        <Chip
                                                            color={getStatusColor(appointment)}
                                                            variant="flat"
                                                            size="sm"
                                                            startContent={getStatusIcon(appointment)}
                                                        >
                                                            {getStatusText(appointment)}
                                                        </Chip>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-default-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {dateTime.shortDate}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {dateTime.time}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => openAppointmentDetails(appointment)}
                                                >
                                                    Vezi detalii
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardBody>
                        </Card>
                    )}
                </div>
            )}

            {/* Appointment Details Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalContent>
                    {selectedAppointment && (
                        <>
                            <ModalHeader>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl">Detalii programare</h3>
                                    <Chip
                                        color={getStatusColor(selectedAppointment)}
                                        variant="flat"
                                        startContent={getStatusIcon(selectedAppointment)}
                                    >
                                        {getStatusText(selectedAppointment)}
                                    </Chip>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-lg mb-3">
                                            {serviceLabels[selectedAppointment.service] || selectedAppointment.service}
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <User className="text-default-400" size={20} />
                                            <div>
                                                <p className="text-sm text-default-600">Nume</p>
                                                <p className="font-medium">{selectedAppointment.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="text-default-400" size={20} />
                                            <div>
                                                <p className="text-sm text-default-600">Email</p>
                                                <p className="font-medium">{selectedAppointment.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="text-default-400" size={20} />
                                            <div>
                                                <p className="text-sm text-default-600">Telefon</p>
                                                <p className="font-medium">{selectedAppointment.phone || 'Nu a fost furnizat'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="text-default-400" size={20} />
                                            <div>
                                                <p className="text-sm text-default-600">Data și ora</p>
                                                <p className="font-medium">
                                                    {formatDateTime(selectedAppointment.dateTime).date}
                                                </p>
                                                <p className="text-sm text-default-600">
                                                    {formatDateTime(selectedAppointment.dateTime).time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedAppointment.message && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageSquare className="text-default-400" size={20} />
                                                <p className="text-sm text-default-600">Mesaj suplimentar</p>
                                            </div>
                                            <div className="bg-default-100 p-3 rounded-lg">
                                                <p className="text-sm">{selectedAppointment.message}</p>
                                            </div>
                                        </div>
                                    )}

                                    <Divider />

                                    <div>
                                        <p className="text-sm text-default-600 mb-1">Programarea a fost făcută la</p>
                                        <p className="text-sm">
                                            {new Date(selectedAppointment.createdAt).toLocaleString('ro-RO')}
                                        </p>
                                    </div>

                                    {!selectedAppointment.confirmed && !formatDateTime(selectedAppointment.dateTime).isPast && (
                                        <div className="bg-warning-50 p-4 rounded-lg border border-warning-200">
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle className="text-warning-600 mt-0.5" size={18} />
                                                <div>
                                                    <p className="text-sm font-medium text-warning-800">
                                                        Programarea în așteptare
                                                    </p>
                                                    <p className="text-sm text-warning-700 mt-1">
                                                        Programarea ta este în așteptarea confirmării.
                                                        Vei fi contactat în scurt timp pentru confirmare.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    Închide
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default UserAppointmentsPage;