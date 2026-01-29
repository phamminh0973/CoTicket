import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col } from 'antd';
import { PhoneOutlined, MailOutlined, FacebookOutlined } from '@ant-design/icons';
import { contactService, ContactInfo } from '../services/contactService';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const response = await contactService.getContactInfo();
        setContactInfo(response.data);
      } catch (error) {
        console.error('Error loading contact info:', error);
      }
    };
    loadContact();
  }, []);

  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: '#001529',
        color: 'rgba(255, 255, 255, 0.85)',
        padding: '40px 50px',
      }}
    >
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={8}>
          <div>
            <PhoneOutlined style={{ fontSize: 20, marginBottom: 8 }} />
            <div>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Số điện thoại</Text>
            </div>
            <div>
              <Link
                href={`tel:${contactInfo?.phone}`}
                style={{ color: '#fff', fontWeight: 'bold' }}
              >
                {contactInfo?.phone || 'Đang tải...'}
              </Link>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div>
            <MailOutlined style={{ fontSize: 20, marginBottom: 8 }} />
            <div>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Email</Text>
            </div>
            <div>
              <Link
                href={`mailto:${contactInfo?.email}`}
                style={{ color: '#fff', fontWeight: 'bold' }}
              >
                {contactInfo?.email || 'Đang tải...'}
              </Link>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div>
            <FacebookOutlined style={{ fontSize: 20, marginBottom: 8 }} />
            <div>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Facebook</Text>
            </div>
            <div>
              <Link
                href={contactInfo?.facebook}
                target="_blank"
                style={{ color: '#fff', fontWeight: 'bold' }}
              >
                CoTicket
              </Link>
            </div>
          </div>
        </Col>
      </Row>
      <div style={{ marginTop: 32, borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: 24 }}>
        <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
          © {new Date().getFullYear()} CoTicket. All rights reserved.
        </Text>
      </div>
    </AntFooter>
  );
};

export default Footer;
