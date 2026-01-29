import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Table,
  Space,
  Upload,
  message,
  Modal,
  Form,
  Input,
  Popconfirm,
  Tag,
} from 'antd';
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../components/AdminLayout';
import { ticketService, Ticket } from '../services/ticketService';

const { Title } = Typography;

const TicketManagementPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [form] = Form.useForm();

  // Load tickets
  const loadTickets = async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    try {
      const response = await ticketService.getAll({ page, limit, search });
      setTickets(response.data);
      setPagination({
        current: response.pagination.page,
        pageSize: response.pagination.limit,
        total: response.pagination.total,
      });
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi tải danh sách vé');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Upload Excel
  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await ticketService.uploadExcel(file);
      
      // Hiển thị kết quả chi tiết
      if (response.data.skipped > 0) {
        Modal.info({
          title: 'Kết quả Upload',
          width: 700,
          content: (
            <div>
              <p><strong>Tổng số dòng:</strong> {response.data.total}</p>
              <p style={{ color: 'green' }}><strong>Import thành công:</strong> {response.data.imported}</p>
              <p style={{ color: 'orange' }}><strong>Bỏ qua:</strong> {response.data.skipped}</p>
              {response.data.duplicates > 0 && (
                <p style={{ color: 'blue' }}>
                  <strong>Trùng mã vé:</strong> {response.data.duplicates} (đã tồn tại trong hệ thống)
                </p>
              )}
              {response.data.errors && response.data.errors.length > 0 && (
                <div style={{ marginTop: 10, maxHeight: 300, overflow: 'auto' }}>
                  <strong>Chi tiết:</strong>
                  <ul>
                    {response.data.errors.slice(0, 20).map((err: any, idx: number) => (
                      <li key={idx} style={{ 
                        color: err.message.includes('⚠️') ? '#1890ff' : '#ff4d4f' 
                      }}>
                        Dòng {err.row}: {err.message}
                      </li>
                    ))}
                    {response.data.errors.length > 20 && (
                      <li>... và {response.data.errors.length - 20} dòng khác</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ),
        });
      } else {
        message.success(response.message);
      }
      
      loadTickets(pagination.current, pagination.pageSize, searchText);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi upload file');
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  // Edit ticket
  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    form.setFieldsValue(ticket);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await ticketService.update(editingTicket!.id, values);
      message.success('Cập nhật vé thành công');
      setEditModalVisible(false);
      loadTickets(pagination.current, pagination.pageSize, searchText);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi cập nhật vé');
    }
  };

  // Delete ticket
  const handleDelete = async (id: number) => {
    try {
      await ticketService.delete(id);
      message.success('Xóa vé thành công');
      loadTickets(pagination.current, pagination.pageSize, searchText);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi xóa vé');
    }
  };

  // Send email single
  const handleSendEmail = async (id: number) => {
    try {
      const response = await ticketService.sendEmailSingle(id);
      message.success(response.message);
      // Reload để cập nhật status
      loadTickets(pagination.current, pagination.pageSize, searchText);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi gửi email');
    }
  };

  // Send email all
  const handleSendEmailAll = async () => {
    Modal.confirm({
      title: 'Gửi email cho tất cả?',
      content: 'Bạn có chắc muốn gửi email mã vé cho tất cả người dùng?',
      okText: 'Gửi',
      cancelText: 'Hủy',
      onOk: async () => {
        const hide = message.loading('Đang gửi email...', 0);
        try {
          const response = await ticketService.sendEmailAll();
          hide();
          
          // Hiển thị kết quả
          if (response.data.failed > 0) {
            Modal.info({
              title: 'Kết quả gửi email',
              width: 600,
              content: (
                <div>
                  <p><strong>Tổng số:</strong> {response.data.total}</p>
                  <p style={{ color: 'green' }}><strong>Thành công:</strong> {response.data.success}</p>
                  <p style={{ color: 'red' }}><strong>Thất bại:</strong> {response.data.failed}</p>
                  {response.data.failedList && response.data.failedList.length > 0 && (
                    <div style={{ marginTop: 10, maxHeight: 300, overflow: 'auto' }}>
                      <strong>Chi tiết lỗi:</strong>
                      <ul>
                        {response.data.failedList.map((item: any, index: number) => (
                          <li key={index}>
                            {item.email}: {item.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ),
            });
          } else {
            message.success(response.message);
          }
          
          // Reload để cập nhật status
          loadTickets(pagination.current, pagination.pageSize, searchText);
        } catch (error: any) {
          hide();
          message.error(error.response?.data?.message || 'Lỗi gửi email');
        }
      },
    });
  };

  // Search
  const handleSearch = () => {
    loadTickets(1, pagination.pageSize, searchText);
  };

  // Table columns
  const columns: ColumnsType<Ticket> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'CCCD',
      dataIndex: 'cccd',
      key: 'cccd',
    },
    {
      title: 'Mã vé',
      dataIndex: 'ticket_code',
      key: 'ticket_code',
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Trạng thái Email',
      dataIndex: 'email_status',
      key: 'email_status',
      width: 150,
      render: (status: string, record: Ticket) => {
        if (!status || status === 'pending') {
          return <Tag color="default">Chưa gửi</Tag>;
        }
        if (status === 'success') {
          return <Tag color="success">Đã gửi</Tag>;
        }
        if (status === 'failed') {
          return (
            <Tag color="error" title={record.email_error}>
              Thất bại
            </Tag>
          );
        }
        return <Tag>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            icon={<MailOutlined />}
            onClick={() => handleSendEmail(record.id)}
          >
            Gửi
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div>
        <Title level={2}>Quản Lý Vé</Title>

        <Space style={{ marginBottom: 16 }}>
          <Upload beforeUpload={handleUpload} accept=".xlsx" showUploadList={false}>
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Excel
            </Button>
          </Upload>
          <Button type="primary" icon={<MailOutlined />} onClick={handleSendEmailAll}>
            Gửi Email Tất Cả
          </Button>
        </Space>

        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <Input
            placeholder="Tìm kiếm theo tên, email, CCCD, mã vé..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Button icon={<SearchOutlined />} onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Tổng ${total} vé`,
          }}
          onChange={(newPagination) => {
            loadTickets(
              newPagination.current || 1,
              newPagination.pageSize || 10,
              searchText
            );
          }}
        />

        {/* Edit Modal */}
        <Modal
          title="Chỉnh sửa vé"
          open={editModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => setEditModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên"
              rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="cccd"
              label="CCCD"
              rules={[{ required: true, message: 'Vui lòng nhập CCCD' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="ticket_code"
              label="Mã vé"
              rules={[{ required: true, message: 'Vui lòng nhập mã vé' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default TicketManagementPage;
