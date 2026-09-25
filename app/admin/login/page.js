export default function LoginPage(){
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
      <div className="bg-white p-8 rounded-[24px] border shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-black">LOGIN ADMIN</h1>
        <p className="text-sm text-gray-500 mt-2">Pasa Gadang CMS</p>
        <input placeholder="Email" className="w-full mt-6 border p-3 rounded-xl"/>
        <input placeholder="Password" type="password" className="w-full mt-3 border p-3 rounded-xl"/>
        <button className="w-full mt-4 bg-black text-white py-3 rounded-xl font-black">Masuk</button>
      </div>
    </div>
  )
}
