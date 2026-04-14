'use client';

import { useEffect, useState, useTransition } from 'react';
import { Search, UserPlus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ContactCard from '@/components/ContactCard';
import ContactForm from '@/components/ContactForm';
import { getContacts } from '@/app/actions/contacts';
import { getCategories } from '@/app/actions/categories';
import { type Contact } from '@/components/ContactCard';

interface Category {
  id: string;
  name: string;
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [, startTransition] = useTransition();

  // 최초 데이터 로드 및 상태 변경 시 데이터 페칭
  useEffect(() => {
    const fetchData = async () => {
      const [c, cat] = await Promise.all([
        getContacts(activeCategoryId || undefined, searchTerm),
        getCategories(),
      ]);
      setContacts(c);
      setCategories(cat);
    };

    startTransition(() => {
      fetchData();
    });
  }, [activeCategoryId, searchTerm, showForm]);

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedContact(null);
  };

  return (
    <>
      <Sidebar 
        categories={categories} 
        activeCategoryId={activeCategoryId} 
        onSelectCategory={setActiveCategoryId} 
      />

      <main className="content">
        <div className="content-inner">
          <div className="top-bar">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="연락처 검색..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-contact-btn" onClick={() => setShowForm(true)}>
              <UserPlus size={18} />
              <span>연락처 추가</span>
            </button>
          </div>

          <div className="contact-grid">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <ContactCard 
                  key={contact.id} 
                  contact={contact} 
                  onEdit={handleEdit} 
                />
              ))
            ) : (
              <div className="empty-state">
                <p>{searchTerm ? '검색 결과가 없습니다.' : '연락처가 없습니다. 새로운 인연을 추가해 보세요!'}</p>
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <ContactForm 
            categories={categories} 
            contact={selectedContact} 
            onClose={handleCloseForm} 
          />
        )}
      </main>

      <style jsx>{`
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .content-inner {
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
        }
        .top-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .search-box {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--fb-text-secondary);
        }
        .search-box input {
          width: 100%;
          padding: 10px 10px 10px 40px;
          background-color: var(--fb-white);
          border: 1px solid var(--fb-border);
          border-radius: 20px;
          font-size: 15px;
          transition: border-color 0.2s;
        }
        .search-box input:focus {
          outline: none;
          background-color: var(--fb-white);
          border-color: var(--fb-blue);
        }
        .add-contact-btn {
          background-color: var(--fb-blue);
          color: white;
          padding: 0 20px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 15px;
          transition: background-color 0.2s;
        }
        .add-contact-btn:hover {
          background-color: #166fe5;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .empty-state {
          text-align: center;
          padding: 60px 0;
          color: var(--fb-text-secondary);
        }
      `}</style>
    </>
  );
}
