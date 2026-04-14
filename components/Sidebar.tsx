'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Hash, LogOut, User as UserIcon } from 'lucide-react';
import { addCategory, deleteCategory } from '@/app/actions/categories';
import { logout } from '@/app/actions/auth';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';

interface Category {
  id: string;
  name: string;
}

interface SidebarProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export default function Sidebar({ categories, activeCategoryId, onSelectCategory }: SidebarProps) {
  const [newCatName, setNewCatName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const handleAdd = async () => {
    if (!newCatName.trim()) return;
    await addCategory(newCatName);
    setNewCatName('');
    setIsAdding(false);
  };

  return (
    <aside className="sidebar">
      {user && (
        <div className="user-profile">
          <div className="user-info">
            <div className="avatar">
              <UserIcon size={20} />
            </div>
            <span className="email">{user.email}</span>
          </div>
          <button className="logout-btn" onClick={() => logout()} title="로그아웃">
            <LogOut size={18} />
          </button>
        </div>
      )}

      <nav className="nav-group">
        <button 
          className={`nav-item ${activeCategoryId === null ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          <Users size={20} className="icon blue" />
          <span>모든 연락처</span>
        </button>
      </nav>

      <div className="sidebar-section">
        <div className="section-header">
          <h3>분류</h3>
          <button className="add-btn" onClick={() => setIsAdding(!isAdding)}>
            <Plus size={16} />
          </button>
        </div>

        {isAdding && (
          <div className="add-category-input">
            <input 
              type="text" 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="분류 이름..."
              onKeyUp={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
          </div>
        )}

        <nav className="nav-group">
          {categories.map((cat) => (
            <div key={cat.id} className={`nav-item-wrapper ${activeCategoryId === cat.id ? 'active' : ''}`}>
              <button 
                className="nav-item"
                onClick={() => onSelectCategory(cat.id)}
              >
                <Hash size={20} className="icon gray" />
                <span>{cat.name}</span>
              </button>
              <button 
                className="delete-item-btn"
                onClick={() => deleteCategory(cat.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </nav>
      </div>
      
      <style jsx>{`
        .sidebar {
          width: 280px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .user-profile {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background-color: var(--fb-white);
          border-radius: 8px;
          margin-bottom: 8px;
          border: 1px solid var(--fb-border);
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }
        .avatar {
          width: 32px;
          height: 32px;
          background-color: var(--fb-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--fb-text-secondary);
          flex-shrink: 0;
        }
        .email {
          font-size: 13px;
          font-weight: 500;
          color: var(--fb-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .logout-btn {
          color: var(--fb-text-secondary);
          padding: 6px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }
        .logout-btn:hover {
          background-color: var(--fb-hover);
          color: var(--danger);
        }
        .nav-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          width: 100%;
          border-radius: 8px;
          font-weight: 600;
          color: var(--fb-text);
          transition: background-color 0.2s;
        }
        .nav-item:hover {
          background-color: var(--fb-hover);
        }
        .nav-item.active {
          background-color: #e7f3ff;
          color: var(--fb-blue);
        }
        .nav-item.active .icon.blue {
          color: var(--fb-blue);
        }
        .sidebar-section {
          margin-top: 8px;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 12px 8px;
          color: var(--fb-text-secondary);
        }
        .section-header h3 {
          font-size: 14px;
          font-weight: 700;
        }
        .add-btn {
          color: var(--fb-blue);
          padding: 4px;
          border-radius: 50%;
        }
        .add-btn:hover {
          background-color: var(--fb-hover);
        }
        .nav-item-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 8px;
        }
        .nav-item-wrapper:hover .delete-item-btn {
          opacity: 1;
        }
        .delete-item-btn {
          position: absolute;
          right: 8px;
          opacity: 0;
          color: var(--fb-text-secondary);
          transition: opacity 0.2s;
          padding: 4px;
        }
        .delete-item-btn:hover {
          color: var(--danger);
        }
        .icon.blue { color: var(--fb-blue); }
        .icon.gray { color: var(--fb-text-secondary); }
        
        .add-category-input {
          padding: 0 12px 8px;
        }
        .add-category-input input {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--fb-border);
          border-radius: 6px;
          font-size: 14px;
        }
      `}</style>
    </aside>
  );
}
