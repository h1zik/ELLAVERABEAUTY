import React, { useEffect, useState } from 'react';
import { Award, Target, Eye, Users } from 'lucide-react';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import { updatePageTitle } from '../utils/pageTitle';

const AboutPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    updatePageTitle('About Us');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sectionsRes = await api.getPageSections('about');
      setSections(sectionsRes.data.filter(s => s.visible).sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Failed to fetch about page data:', error);
      setError('Failed to load page content');
    } finally {
      setLoading(false);
    }
  };

  const getSection = (sectionType) => {
    return sections.find(s => s.section_type === sectionType);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Get section data
  const heroSection = getSection('hero');
  const textSection = getSection('text');
  const visionMissionSection = getSection('vision_mission');
  const certificationsSection = getSection('certifications');
  const proofCertificationsSection = getSection('proof_certifications');
  const teamSection = getSection('team');

  // Default certifications if not customized
  const defaultCertifications = [
    { name: 'BPOM Certified', description: 'Indonesian FDA Approved' },
    { name: 'Halal Certified', description: 'MUI Halal Certification' },
    { name: 'ISO 9001:2015', description: 'Quality Management System' },
    { name: 'GMP Certified', description: 'Good Manufacturing Practice' }
  ];

  const certifications = certificationsSection?.content?.items || defaultCertifications;

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="about-page">
      {/* Hero */}
      {heroSection && (
        <section className="bg-gradient-to-br from-primary-light to-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="about-title">
              {heroSection.content.title && (
                <>
                  {heroSection.content.title.split(' ').slice(0, -2).join(' ')}{' '}
                  <span className="text-gradient">{heroSection.content.title.split(' ').slice(-2).join(' ')}</span>
                </>
              )}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {heroSection.content.description || 'Your trusted partner in cosmetic manufacturing excellence'}
            </p>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Company Story */}
        {textSection && (
          <section className="mb-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">{textSection.content.heading || 'Our Story'}</h2>
              {textSection.content.paragraphs?.map((paragraph, index) => (
                <p key={index} className="text-lg text-slate-600 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Vision & Mission */}
        {visionMissionSection && (
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {visionMissionSection.content.vision && (
                <Card className="p-8 border-none shadow-lg">
                  <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Eye className="text-primary" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{visionMissionSection.content.vision.title || 'Our Vision'}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {visionMissionSection.content.vision.text}
                  </p>
                </Card>
              )}

              {visionMissionSection.content.mission && (
                <Card className="p-8 border-none shadow-lg">
                  <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Target className="text-primary" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{visionMissionSection.content.mission.title || 'Our Mission'}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {visionMissionSection.content.mission.text}
                  </p>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Certifications */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {certificationsSection?.content?.heading || 'Certifications & Quality Standards'}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {certificationsSection?.content?.subheading || 'We maintain the highest industry standards and certifications'}
            </p>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto ${
            certifications.length <= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {certifications.map((cert, index) => (
              <Card key={index} className="p-6 text-center border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-primary" size={28} />
                </div>
                <h4 className="font-semibold mb-1">{cert.name}</h4>
                {cert.description && (
                  <p className="text-sm text-slate-500">{cert.description}</p>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {teamSection?.content?.heading || 'Our Expert Team'}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {teamSection?.content?.subheading || 'Led by experienced professionals in cosmetic science and manufacturing'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary-light to-white rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
            <div className="bg-primary-light w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-primary" size={36} />
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
              {teamSection?.content?.description || 'Our team consists of skilled chemists, quality control specialists, production managers, and customer service professionals who are dedicated to delivering excellence in every project. With decades of combined experience, we bring deep industry knowledge and innovative thinking to every formulation.'}
            </p>
          </div>

          {/* Team Members Grid (if provided) */}
          {teamSection?.content?.members && teamSection.content.members.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12">
              {teamSection.content.members.map((member, index) => (
                <Card key={index} className="p-6 text-center border-none shadow-md">
                  <div className="w-24 h-24 rounded-full bg-primary-light mx-auto mb-4 overflow-hidden">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="text-primary" size={32} />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-primary">{member.position}</p>
                  {member.bio && (
                    <p className="text-sm text-slate-500 mt-2">{member.bio}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
