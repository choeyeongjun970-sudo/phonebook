'use client';

import { Phone, Mail, MoreHorizontal, User, Trash2, Edit2 } from 'lucide-react';
import { deleteContact } from '@/app/actions/contacts';
import { useState } from 'react';

interface Contact {
  id: string;
  name: string;
  phone_number: string;
  memo: string;
  category_id: string;
  avatar_url?: string;
  categories?: {
    name: string;
  };
}

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
}

export default function ContactCard({ contact, onEdit }: ContactCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setIsDeleting(true);
      const result = await deleteContact(contact.id);
      
      if (result?.success) {
        window.location.reload(); // 최신 데이터 반영을 위해 페이지 새로고침
      } else {
        alert('삭제에 실패했습니다: ' + (result?.error || '알 수 없는 오류'));
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className={`contact-card ${isDeleting ? 'deleting' : ''}`}>
      <div className="card-header">
        <div className="avatar">
          {contact.avatar_url ? (
            <img src={contact.avatar_url} alt={contact.name} className="avatar-img" />
          ) : (
            <User size={24} className="icon-user" />
          )}
        </div>
        <div className="info">
          <span className="name">{contact.name}</span>
          <span className="category-badge">{contact.categories?.name || '분류 없음'}</span>
        </div>
        <div className="actions">
          <button className="action-btn" onClick={() => onEdit(contact)}>
            <Edit2 size={16} />
          </button>
          <button className="action-btn danger" onClick={handleDelete}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="card-content">
        <div className="phone-line">
          <Phone size={14} className="icon-phone" />
          <span>{contact.phone_number}</span>
        </div>
        {contact.memo && (
          <div className="memo-line">
            <p>{contact.memo}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .contact-card {
          background-color: var(--fb-white);
          border-radius: 12px;
          padding: 16px;
          box-shadow: var(--fb-shadow);
          transition: transform 0.2s, opacity 0.2s;
        }
        .contact-card:hover {
          transform: translateY(-2px);
        }
        .contact-card.deleting {
          opacity: 0.5;
          pointer-events: none;
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .avatar {
          width: 48px;
          height: 48px;
          background-color: var(--fb-hover);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--fb-text-secondary);
          overflow: hidden;
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .name {
          font-size: 16px;
          font-weight: 700;
          color: var(--fb-text);
        }
        .category-badge {
          font-size: 12px;
          color: var(--fb-text-secondary);
          background-color: var(--fb-bg);
          padding: 2px 6px;
          border-radius: 4px;
          width: fit-content;
          margin-top: 2px;
        }
        .actions {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          padding: 8px;
          border-radius: 50%;
          color: var(--fb-text-secondary);
          transition: background-color 0.2s;
        }
        .action-btn:hover {
          background-color: var(--fb-hover);
        }
        .action-btn.danger:hover {
          color: var(--danger);
          background-color: #fee2e2;
        }
        .card-content {
          border-top: 1px solid var(--fb-border);
          padding-top: 12px;
        }
        .phone-line {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--fb-blue);
          font-size: 15px;
        }
        .memo-line {
          margin-top: 8px;
          background-color: var(--fb-bg);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          color: var(--fb-text-secondary);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
