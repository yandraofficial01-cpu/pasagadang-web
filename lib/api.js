const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = {
  getProperties: () => fetch(`${API_URL}/properties/`).then(r=>r.json()),
  getMaterials: () => fetch(`${API_URL}/materials/`).then(r=>r.json()),
  getBlogs: () => fetch(`${API_URL}/blogs/`).then(r=>r.json()),
  calculateKPR: (data) => fetch(`${API_URL}/calculator/kpr/`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}).then(r=>r.json()),
  calculateMaterial: (data) => fetch(`${API_URL}/calculator/material/`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}).then(r=>r.json()),
}
