import React from 'react';
import { Award, Target, Eye, Users } from 'lucide-react';
import { Card } from '../components/ui/card';

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="about-page">
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="about-title">
            About <span className="text-gradient">Ellavera Beauty</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your trusted partner in cosmetic manufacturing excellence
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Company Story */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <p className="text-lg text-slate-600 mb-4 leading-relaxed">
              Ellavera Beauty was founded with a singular vision: to empower beauty brands with world-class cosmetic manufacturing services. With years of expertise in the cosmetics industry, we understand the unique challenges brands face in bringing their products to market.
            </p>
            <p className="text-lg text-slate-600 mb-4 leading-relaxed">
              We specialize in custom formulation, private label manufacturing, and complete turnkey solutions. Our state-of-the-art facilities are equipped with the latest technology, allowing us to create products that meet the highest quality standards while maintaining competitive pricing.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              From skincare to haircare, body care to fragrances, we have the capability and expertise to manufacture a wide range of cosmetic products. Our commitment to quality, innovation, and customer satisfaction has made us a preferred partner for brands across the globe.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 border-none shadow-lg">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Eye className="text-cyan-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                To be the leading cosmetic manufacturer that enables beauty brands worldwide to create exceptional products that inspire confidence and transform lives.
              </p>
            </Card>

            <Card className="p-8 border-none shadow-lg">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Target className="text-cyan-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To provide innovative, high-quality cosmetic manufacturing solutions with unparalleled customer service, helping brands bring their vision to life through cutting-edge formulations and sustainable practices.
              </p>
            </Card>
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Certifications & Quality Standards</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We maintain the highest industry standards and certifications
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {['BPOM Certified', 'Halal Certified', 'ISO 9001:2015', 'GMP Certified'].map((cert, index) => (
              <Card key={index} className="p-6 text-center border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-cyan-600" size={28} />
                </div>
                <h4 className="font-semibold">{cert}</h4>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Expert Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Led by experienced professionals in cosmetic science and manufacturing
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
            <div className="bg-cyan-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-cyan-600" size={36} />
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our team consists of skilled chemists, quality control specialists, production managers, and customer service professionals who are dedicated to delivering excellence in every project. With decades of combined experience, we bring deep industry knowledge and innovative thinking to every formulation.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
