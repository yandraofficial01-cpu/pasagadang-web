export default function PropertyCard({p}){
 return <div className="bg-white rounded-2xl p-4 shadow"><h3 className="font-black">{p?.title || 'Rumah Gadang Modern'}</h3><p className="text-sm text-gray-500">{p?.location || 'Padang'}</p><p className="font-bold mt-2">Rp {p?.price || '450jt'}</p></div>
  }
