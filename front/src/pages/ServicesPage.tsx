import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Divider
} from '@nextui-org/react';
import { Link } from 'react-router-dom'
import {CheckCircle, Clock, HeartPulse, Utensils} from 'lucide-react';

const ServicesPage: React.FC = () => {
    const services = [
        {
            id: 1,
            title: "Consult Nutrițional Inițial",
            description: "Evaluare completă a stării de sănătate, analiza obiceiurilor alimentare și stabilirea obiectivelor.",
            duration: "90 minute",
            icon: <Utensils className="text-primary" size={24} />
        },
        {
            id: 2,
            title: "Consult de Urmărire",
            description: "Monitorizarea progresului, ajustarea planului alimentar și soluționarea dificultăților întâmpinate.",
            duration: "60 minute",
            icon: <CheckCircle className="text-primary" size={24} />
        },
        {
            id: 3,
            title: "Plan Alimentar Personalizat",
            description: "Elaborarea unui plan alimentar adaptat nevoilor, preferințelor și stilului de viață.",
            duration: "Personalizat",
            icon: <HeartPulse className="text-primary" size={24} />
        },
        {
            id: 4,
            title: "Program de Nutriție Sportivă",
            description: "Planuri nutriționale pentru sportivi, adaptate tipului de activitate și obiectivelor.",
            duration: "120 minute",
            icon: <Clock className="text-primary" size={24} />
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 space-y-6 py-8">
            <Card className="mb-6">
                <CardHeader>
                    <h1 className="text-2xl font-bold">Servicii oferite</h1>
                </CardHeader>
                <CardBody className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map(service => (
                            <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary-100 rounded-full">
                                        {service.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{service.title}</h3>
                                        <p className="text-default-600 mt-2">{service.description}</p>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-sm text-default-500">{service.duration}</span>

                                        </div>
                                        <Button
                                            color="primary"
                                            variant="flat"
                                            className="mt-4"
                                            as={Link}
                                            to="/booking"
                                        >
                                            Programează-te
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Divider className="my-8" />

                    <div className="bg-primary-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Ce include un consult nutrițional?</h2>
                        <ul className="list-disc pl-5 space-y-2 text-default-600">
                            <li>Analiza compoziției corporale (greutate, înălțime, IMC, circumferințe)</li>
                            <li>Evaluarea obiceiurilor alimentare actuale</li>
                            <li>Identificarea factorilor de risc și a problemelor nutriționale</li>
                            <li>Recomandări nutriționale personalizate</li>
                            <li>Plan alimentar adaptat nevoilor și preferințelor</li>
                            <li>Sfaturi pentru cumpărături și preparare alimente</li>
                        </ul>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default ServicesPage;