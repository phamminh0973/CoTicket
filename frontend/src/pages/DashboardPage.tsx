import React from 'react';
import { Card, Row, Col, Statistic, Typography, Button } from 'antd';
import { FileTextOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const { Title, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div>
        <Title level={2}>Dashboard</Title>
        <Paragraph>
          Chào mừng bạn đến với hệ thống quản lý vé CoTicket
        </Paragraph>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Tổng số vé"
                value={0}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Email đã gửi"
                value={0}
                prefix={<MailOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Người dùng"
                value={0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        <Card style={{ marginTop: 24 }}>
          <Title level={4}>Bắt đầu nhanh</Title>
          <Paragraph>
            <ul>
              <li>Upload file Excel để import danh sách vé</li>
              <li>Quản lý và chỉnh sửa thông tin vé</li>
              <li>Gửi email mã vé cho khách hàng</li>
            </ul>
          </Paragraph>
          <Button type="primary" size="large" onClick={() => navigate('/admin/tickets')}>
            Đi đến Quản lý vé
          </Button>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
