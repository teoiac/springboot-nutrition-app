import React from 'react';
import {apiService} from "../services/apiService.ts";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Textarea,
    Button,
    Divider,
    Link
} from '@nextui-org/react';
import {Facebook, Mail, MapPin} from 'lucide-react';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await apiService.sendContactMessage(formData);
            console.log('Message sent successfully:', response);
            alert('Thank you for your message! We will get back to you soon.');
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="max-w-6xl mx-auto px-4 space-y-6 py-8">
            <Card className="mb-6">
                <CardHeader>
                    <h1 className="text-2xl font-bold">Sănătatea ta conteaza!</h1>
                </CardHeader>
                <CardBody className="space-y-6">
                    {error && (
                        <div className="p-4 mb-4 bg-danger-100 text-danger-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Contactează-mă pentru o discuție personalizată </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    isRequired
                                    label="Nume"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    variant="bordered"
                                />
                                <Input
                                    isRequired
                                    type="email"
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    variant="bordered"
                                />
                                <Textarea
                                    isRequired
                                    label="Mesajul tău"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    variant="bordered"
                                    minRows={5}
                                />
                                <Button type="submit" color="primary" fullWidth isLoading={isSubmitting}>
                                    {isSubmitting ? 'Se trimite...' : 'Trimite Mesaj'}
                                </Button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Informații de contact</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary-100 rounded-full">
                                        <MapPin className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Adresă</h3>
                                        <p className="text-default-600">Valea Adâncă, Iași, Romania</p>
                                    </div>
                                </div>

                                <Divider />

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary-100 rounded-full">
                                        <Mail className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Email</h3>
                                        <p className="text-default-600">
                                            <Link href="mailto:nasafteinutritie@gmail.com" color="foreground">
                                                nasafteinutritie@gmail.com
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                                <Divider />

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary-100 rounded-full">
                                        <Facebook className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Facebook</h3>
                                        <p className="text-default-600"><a href={"https://www.facebook.com/nico.tehniciannutitionist"}> Nico Tehnician Nutriționist</a></p>

                                    </div>
                                </div>

                                <Divider />

                                <div>
                                    <h3 className="font-medium mb-2">Follow Us</h3>
                                    <div className="flex gap-4">
                                        <Link isExternal href="#">
                                            <span className="text-default-600 hover:text-primary">Facebook</span>
                                        </Link>
                                        <Link isExternal href="#">
                                            <span className="text-default-600 hover:text-primary">Twitter</span>
                                        </Link>
                                        <Link isExternal href="#">
                                            <span className="text-default-600 hover:text-primary">Instagram</span>
                                        </Link>
                                        <Link isExternal href="#">
                                            <span className="text-default-600 hover:text-primary">LinkedIn</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Find Us</h2>
                        <div className="aspect-w-16 aspect-h-9 bg-default-100 rounded-lg overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21718.025210738742!2d27.529570845024168!3d47.123508946623325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40cafaf64f230705%3A0xb3d153c49477ac61!2zNzA3MzE3IFZhbGVhIEFkw6JuY8SD!5e0!3m2!1sro!2sro!4v1749482347883!5m2!1sro!2sro"
                                width="100%"
                                height="400"
                                style={{border: 0}}
                                allowFullScreen
                                loading="lazy"
                                title="Our Location"
                            ></iframe>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default ContactPage;