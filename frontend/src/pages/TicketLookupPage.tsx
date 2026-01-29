import React, { useState } from 'react';
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Result,
  Row,
  Col,
  message,
  Space,
} from 'antd';
import { SearchOutlined, DownloadOutlined, QrcodeOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { ticketService } from '../services/ticketService';

const { Content, Header } = Layout;
const { Title, Paragraph, Text } = Typography;

interface TicketResult {
  name: string;
  email: string;
  ticket_code: string;
  qr_code: string;
}

const TicketLookupPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState<TicketResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  const onFinish = async (values: { cccd: string }) => {
    setLoading(true);
    setTicketResult(null);
    setNotFound(false);

    try {
      const response = await ticketService.lookup(values.cccd);
      setTicketResult(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        message.error(error.response?.data?.message || 'Lỗi tra cứu vé');
      }
    } finally {
      setLoading(false);
    }
  };

  // Download QR code
  const handleDownloadQR = () => {
    if (!ticketResult) return;

    const link = document.createElement('a');
    link.href = ticketResult.qr_code;
    link.download = `ticket-${ticketResult.ticket_code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Đã tải xuống mã QR');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <Title 
            level={3} 
            style={{ color: 'white', margin: 0, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            🎫 CoTicket
          </Title>
          <Button 
            type="primary" 
            icon={<LoginOutlined />}
            onClick={() => navigate('/login')}
          >
            Đăng nhập Admin
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '50px' }}>
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12}>
            <Card
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '8px',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <QrcodeOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                <Title level={2} style={{ marginTop: 16 }}>
                  Tra Cứu Vé Sự Kiện
                </Title>
                <Paragraph type="secondary">
                  Nhập số CCCD của bạn để tra cứu thông tin vé
                </Paragraph>
              </div>

              <Form onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                  name="cccd"
                  label="Số CCCD"
                  rules={[
                    { required: true, message: 'Vui lòng nhập CCCD!' },
                    {
                      pattern: /^[0-9]{9,12}$/,
                      message: 'CCCD phải có từ 9-12 chữ số',
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập số CCCD (9-12 số)"
                    maxLength={12}
                    autoComplete="off"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                    block
                    size="large"
                  >
                    Tra Cứu
                  </Button>
                </Form.Item>
              </Form>

              {/* Kết quả tìm thấy */}
              {ticketResult && (
                <div style={{ marginTop: 32, textAlign: 'center' }}>
                  <Result
                    status="success"
                    title="Tìm Thấy Vé!"
                    subTitle={
                      <Space direction="vertical" size="small">
                        <Text>
                          <strong>Họ tên:</strong> {ticketResult.name}
                        </Text>
                        <Text>
                          <strong>Email:</strong> {ticketResult.email}
                        </Text>
                      </Space>
                    }
                  />

                  <Card
                    style={{
                      background: '#f0f2f5',
                      marginTop: 16,
                      borderRadius: '8px',
                    }}
                  >
                    <Title level={4} style={{ color: '#1890ff', marginBottom: 8 }}>
                      Mã Vé
                    </Title>
                    <Title level={2} style={{ margin: 0 }}>
                      {ticketResult.ticket_code}
                    </Title>
                  </Card>

                  <div style={{ marginTop: 24 }}>
                    <Title level={4}>Mã QR</Title>
                    <img
                      src={ticketResult.qr_code}
                      alt="QR Code"
                      style={{ maxWidth: 250, height: 'auto' }}
                    />
                    <div style={{ marginTop: 16 }}>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadQR}
                        size="large"
                      >
                        Tải Xuống Mã QR
                      </Button>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 24,
                      padding: 16,
                      background: '#fff7e6',
                      borderRadius: 8,
                      border: '1px solid #ffd591',
                    }}
                  >
                    <Text type="warning">
                      <strong>⚠️ Lưu ý:</strong> Vui lòng lưu lại mã QR này để tham dự sự
                      kiện. Xuất trình mã QR tại cổng check-in.
                    </Text>
                  </div>
                </div>
              )}

              {/* Không tìm thấy */}
              {notFound && (
                <div style={{ marginTop: 32 }}>
                  <Result
                    status="404"
                    title="Không Tìm Thấy Vé"
                    subTitle="Không tìm thấy vé với số CCCD này. Vui lòng kiểm tra lại số CCCD hoặc liên hệ ban tổ chức."
                  />
                </div>
              )}
            </Card>

            {/* Hướng dẫn */}
            <Card style={{ marginTop: 24 }}>
              <Title level={4}>📝 Hướng Dẫn</Title>
              <ul>
                <li>Nhập đúng số CCCD đã đăng ký tham gia sự kiện</li>
                <li>Hệ thống sẽ hiển thị mã vé và mã QR của bạn</li>
                <li>Tải xuống hoặc chụp ảnh mã QR để sử dụng khi check-in</li>
                <li>Mỗi mã QR chỉ được sử dụng một lần</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer />
    </Layout>
  );
};

export default TicketLookupPage;
