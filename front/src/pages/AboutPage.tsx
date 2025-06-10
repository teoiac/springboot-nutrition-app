import React from 'react';

import {
    Card,
    CardHeader,
    CardBody,
    Image,
    Divider,
    Link
} from '@nextui-org/react';
import {Facebook, Mail,MapPin} from 'lucide-react';

const AboutPage: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 space-y-6 py-8">
            <Card className="mb-6">
                <CardHeader>
                    <h1 className="text-2xl font-bold">Despre Mine</h1>
                </CardHeader>
                <CardBody className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* About Content */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Cine sunt eu?</h2>
                            <p className="text-default-600">
                                Bună! Eu sunt Nico, tehnician nutriționist pasionat de sănătate și alimentație corectă.
                            </p>
                            <p className="text-default-600">
                                Cred cu tărie că alimentația corectă este cheia unei vieți sănătoase și pline de energie.
                                Misiunea mea este să te ajut să găsești echilibrul alimentar potrivit pentru stilul tău de viață.
                            </p>

                            <h2 className="text-xl font-semibold mt-6">Calificări și Certificări</h2>
                            <ul className="list-disc pl-5 space-y-2 text-default-600">
                                <li>Diplomă în Nutriție și Dietetică</li>
                                <li>Certificat în Nutriție Sportivă</li>
                                <li>Specializare în Alimentație pentru Boli Cronice</li>
                                <li>Membru al Asociației Române de Nutriție</li>
                            </ul>
                        </div>

                        {/* Photo and Contact Info */}
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <Image
                                    src="/images/profile.jpg"
                                    alt="Nico Tehnician Nutriționist"
                                    className="w-full max-w-md rounded-lg"
                                />
                            </div>

                            <Divider />

                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Contact Rapid</h3>
                                <div className="flex items-center gap-4">
                                    <Mail className="text-primary" />
                                    <Link href="mailto:nasafteinutritie@gmail.com" color="foreground">
                                        nasafteinutritie@gmail.com
                                    </Link>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Facebook className="text-primary" />
                                    <Link href="https://www.facebook.com/nico.tehniciannutitionist" color="foreground">
                                        Nico Tehnician Nutriționist
                                    </Link>
                                </div>
                                <div className="flex items-center gap-4">
                                    <MapPin className="text-primary"/>
                                    Valea Adanca, Iasi, Romania
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Philosophy Section */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Filozofia mea</h2>
                        <div className="bg-primary-50 p-6 rounded-lg">
                            <p className="text-default-700 italic">
                                "Nu există o dietă universală care să funcționeze pentru toți. Fiecare persoană este unică și
                                are nevoi nutriționale specifice. Abordarea mea este personalizată și adaptată stilului tău
                                de viață, preferințelor și obiectivelor tale de sănătate."
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default AboutPage;