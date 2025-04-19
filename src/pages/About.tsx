import { ReactElement } from "react"
import Table from "../components/table/Table"
import Header from "../components/header/header"
import Footer from "../components/footer/Footer"


function About(): ReactElement {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl mb-20">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-600">Giới thiệu về FreshFruit Shop</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-500 mb-2">🍊 Chúng tôi là ai?</h2>
        <p className="text-gray-700 leading-relaxed">
          FreshFruit Shop là cửa hàng chuyên cung cấp các loại trái cây tươi ngon, đảm bảo chất lượng và nguồn gốc rõ ràng. 
          Chúng tôi luôn đặt sức khỏe của khách hàng lên hàng đầu, mang đến những sản phẩm giàu dinh dưỡng và an toàn vệ sinh thực phẩm.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-500 mb-2">🎯 Sứ mệnh của chúng tôi</h2>
        <p className="text-gray-700 leading-relaxed">
          Sứ mệnh của FreshFruit Shop là kết nối nông sản Việt với người tiêu dùng, mang lại nguồn thực phẩm sạch, tươi mới và đáng tin cậy. 
          Chúng tôi cam kết xây dựng một hệ sinh thái bền vững giữa nông dân, khách hàng và môi trường.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-500 mb-2">🛒 Sản phẩm của chúng tôi</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Các loại trái cây theo mùa: cam, quýt, bưởi, xoài, vải, nhãn…</li>
          <li>Trái cây nhập khẩu cao cấp: táo Mỹ, nho Úc, kiwi New Zealand…</li>
          <li>Hộp quà trái cây sang trọng cho dịp lễ, tết, sinh nhật…</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-500 mb-2">🤝 Cảm ơn bạn đã đồng hành!</h2>
        <p className="text-gray-700 leading-relaxed">
          FreshFruit Shop rất hân hạnh được phục vụ bạn. Hãy ghé thăm cửa hàng hoặc đặt hàng online để trải nghiệm trái cây tươi sạch mỗi ngày!
        </p>
      </section>
    </div>
  )
}

export default About
