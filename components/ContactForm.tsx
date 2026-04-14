'use client';

import { useState, useRef } from 'react';
import { X, Camera, User } from 'lucide-react';
import { addContact, updateContact } from '@/app/actions/contacts';
import { createClient } from '@/utils/supabase/client';

interface Category {
  id: string;
  name: string;
}

interface Contact {
  id: string;
  name: string;
  phone_number: string;
  memo: string;
  category_id: string;
  avatar_url?: string;
}

interface ContactFormProps {
  categories: Category[];
  contact?: Contact | null;
  onClose: () => void;
}

export default function ContactForm({ categories, contact, onClose }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(contact?.avatar_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadAvatar = async (file: File, id: string): Promise<string | null> => {
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const filePath = `${id}.${ext}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error('[uploadAvatar] 업로드 실패:', error);
      return null;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    if (selectedFile) {
      // 새 연락처는 임시 UUID, 기존 연락처는 그 ID 사용
      const uploadId = contact?.id || crypto.randomUUID();
      const avatarUrl = await uploadAvatar(selectedFile, uploadId);
      if (avatarUrl) {
        formData.set('avatar_url', avatarUrl);
      }
    } else if (contact?.avatar_url) {
      formData.set('avatar_url', contact.avatar_url);
    }

    if (contact) {
      await updateContact(contact.id, formData);
    } else {
      await addContact(formData);
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{contact ? '연락처 수정' : '새 연락처 추가'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 사진 업로드 */}
          <div className="avatar-upload-area">
            <div className="avatar-preview" onClick={() => fileInputRef.current?.click()}>
              {previewUrl ? (
                <img src={previewUrl} alt="프로필 사진" className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">
                  <User size={40} color="#bcc0c4" />
                </div>
              )}
              <div className="avatar-overlay">
                <Camera size={20} color="white" />
              </div>
            </div>
            <p className="avatar-hint">클릭하여 사진 선택</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="name">이름</label>
            <input type="text" id="name" name="name" defaultValue={contact?.name || ''} required placeholder="이름을 입력하세요" />
          </div>

          <div className="input-group">
            <label htmlFor="phone_number">전화번호</label>
            <input type="text" id="phone_number" name="phone_number" defaultValue={contact?.phone_number || ''} required placeholder="010-0000-0000" />
          </div>

          <div className="input-group">
            <label htmlFor="category_id">분류</label>
            <select id="category_id" name="category_id" defaultValue={contact?.category_id || ''}>
              <option value="">분류 선택 안함</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="memo">메모</label>
            <textarea id="memo" name="memo" rows={3} defaultValue={contact?.memo || ''} placeholder="추가 메모를 입력하세요" />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>취소</button>
            <button type="submit" className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : (contact ? '수정 완료' : '추가하기')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(244, 244, 244, 0.8); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal-content {
          background-color: var(--fb-white); width: 100%; max-width: 440px;
          border-radius: 12px;
          box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
          padding: 24px; max-height: 90vh; overflow-y: auto;
        }
        .modal-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
        }
        .modal-header h2 { font-size: 20px; font-weight: 700; color: var(--fb-text); }
        .close-btn { color: var(--fb-text-secondary); padding: 8px; border-radius: 50%; transition: background-color 0.2s; }
        .close-btn:hover { background-color: var(--fb-hover); }
        .avatar-upload-area {
          display: flex; flex-direction: column; align-items: center; margin-bottom: 20px; gap: 8px;
        }
        .avatar-preview {
          position: relative; width: 96px; height: 96px; border-radius: 50%;
          overflow: hidden; cursor: pointer;
          border: 2px dashed var(--fb-border);
          background-color: var(--fb-bg);
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s;
        }
        .avatar-preview:hover { border-color: var(--fb-blue); }
        .avatar-preview:hover .avatar-overlay { opacity: 1; }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-placeholder { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
        .avatar-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s;
        }
        .avatar-hint { font-size: 12px; color: var(--fb-text-secondary); }
        .input-group { margin-bottom: 16px; }
        .input-group label { display: block; font-size: 14px; font-weight: 600; color: var(--fb-text-secondary); margin-bottom: 6px; }
        .input-group input, .input-group select, .input-group textarea {
          width: 100%; padding: 10px 12px; border: 1px solid var(--fb-border);
          border-radius: 8px; font-size: 15px; background-color: var(--fb-bg); transition: border-color 0.2s;
        }
        .input-group input:focus, .input-group select:focus, .input-group textarea:focus {
          outline: none; border-color: var(--fb-blue); background-color: var(--fb-white);
        }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        .btn { padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 15px; transition: background-color 0.2s; }
        .btn.primary { background-color: var(--fb-blue); color: white; }
        .btn.primary:hover { background-color: #166fe5; }
        .btn.primary:disabled { background-color: #8dbfff; cursor: not-allowed; }
        .btn.secondary { background-color: var(--fb-hover); color: var(--fb-text); }
        .btn.secondary:hover { background-color: #d8dadf; }
      `}</style>
    </div>
  );
}
