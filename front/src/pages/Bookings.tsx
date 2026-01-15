import React from 'react';
import {apiService} from "../services/apiService.ts";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Divider,
    Select,
    SelectItem,
    Textarea
} from '@nextui-org/react';
import {Calendar, Clock, Mail, MapPin, User} from 'lucide-react';

const BookingsPage: React.FC = () => {

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    const services = [
        {value: 'initial', label: 'Consult Nutrițional Inițial'},
        {value: 'followup', label: 'Consult de Urmărire'},
        {value: 'mealplan', label: 'Plan Alimentar Personalizat'},
        {value: 'sport', label: 'Program de Nutriție Sportivă'},
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            service: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            // Combine date and time into ISO string
            const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();

            const bookingRequest = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                service: formData.service,
                dateTime: dateTime,
                message: formData.message || undefined
            };

            const response = await apiService.createBooking(bookingRequest);

            console.log('Booking created:', response);
            setSuccess('Programarea ta a fost înregistrată! Te voi contacta în scurt timp pentru confirmare.');

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                service: '',
                date: '',
                time: '',
                message: ''
            });
        } catch (err: any) {
            console.error('Error submitting booking:', err);

            // Handle API errors
            if (err.status && err.message) {
                setError(err.message);
            } else {
                setError('Nu s-a putut trimite programarea. Te rugăm să încerci din nou mai târziu.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 space-y-6 py-8">
            <Card className="mb-6">
                <CardHeader>
                    <h1 className="text-2xl font-bold">Programează o consultație</h1>
                </CardHeader>
                <CardBody className="space-y-6">
                    {error && (
                        <div className="p-4 mb-4 bg-danger-100 text-danger-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-4 mb-4 bg-success-100 text-success-700 rounded-lg">
                            {success}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Booking Form */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Completează formularul</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    isRequired
                                    label="Nume complet"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    variant="bordered"
                                    startContent={<User className="text-default-400" size={18} />}
                                />
                                <Input
                                    isRequired
                                    type="email"
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    variant="bordered"
                                    startContent={<Mail className="text-default-400" size={18} />}
                                />
                                <Input
                                    label="Telefon"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    variant="bordered"
                                    placeholder="+40 _________"
                                />
                                <Select
                                    isRequired
                                    label="Selectează serviciul"
                                    variant="bordered"
                                    selectedKeys={formData.service ? [formData.service] : []}
                                    onChange={(e) => handleSelectChange(e.target.value)}
                                >
                                    {services.map((service) => (
                                        <SelectItem key={service.value} value={service.value}>
                                            {service.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        isRequired
                                        type="date"
                                        label="Data"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        variant="bordered"
                                        min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                        startContent={<Calendar className="text-default-400" size={18} />}
                                    />
                                    <Input
                                        isRequired
                                        type="time"
                                        label="Ora"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        variant="bordered"
                                        startContent={<Clock className="text-default-400" size={18} />}
                                    />
                                </div>
                                <Textarea
                                    label="Mesaj suplimentar"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    variant="bordered"
                                    placeholder="Menționează aici orice informații relevante..."
                                />
                                <Button
                                    type="submit"
                                    color="primary"
                                    fullWidth
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Se trimite...' : 'Programează-te acum'}
                                </Button>
                            </form>
                        </div>

                        {/* Booking Information */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Informații importante</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary-100 rounded-full">
                                        <MapPin className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Locație consultații</h3>
                                        <p className="text-default-600">Valea Adâncă, Iași, Romania</p>
                                        <p className="text-default-600 mt-2">Consultațiile se pot desfășura și online prin Zoom/Skype.</p>
                                    </div>
                                </div>

                                <Divider />

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary-100 rounded-full">
                                        <Clock className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Program</h3>
                                        <p className="text-default-600">Luni - Vineri: 09:00 - 18:00</p>
                                        <p className="text-default-600">Sâmbătă: 10:00 - 14:00</p>
                                        <p className="text-default-600">Duminică: Închis</p>
                                    </div>
                                </div>

                                <Divider />

                                <div>
                                    <h3 className="font-medium mb-2">Politica de anulare</h3>
                                    <p className="text-default-600">
                                        Programările pot fi anulate sau reprogramate cu cel puțin 24 de ore înainte.
                                        Anulările de ultim moment pot fi supuse unei taxe.
                                    </p>
                                </div>

                                <Divider />

                                <div>
                                    <h3 className="font-medium mb-2">Pregătire pentru consultație</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-default-600">
                                        <li>Vă rugăm să veniți cu 10 minute înainte</li>
                                        <li>Aduceți rezultatele analizelor medicale recente (dacă aveți)</li>
                                        <li>Puteți aduce un jurnal alimentar (dacă țineți)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default BookingsPage;