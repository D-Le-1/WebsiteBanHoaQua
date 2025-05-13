import { ReactElement } from "react"
import Table from "../components/table/Table"
import Header from "../components/header/header"
import Footer from "../components/footer/Footer"
import { useTranslation } from "react-i18next"


function About(): ReactElement {
  const { t } = useTranslation()
  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl mb-20">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-600">{t("about.title")}</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-500 mb-2">🍊 {t("about.who_we_are.title")}</h2>
        <p className="text-gray-700 leading-relaxed">
          {t("about.who_we_are.description")}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-500 mb-2">🎯 {t("about.mission.title")}</h2>
        <p className="text-gray-700 leading-relaxed">
          {t("about.mission.description")}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-500 mb-2">🛒 {t("about.products.title")}</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>{t("about.products.items.0")}</li>
          <li>{t("about.products.items.1")}</li>
          <li>{t("about.products.items.2")}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-500 mb-2">🤝 {t("about.thanks.title")}</h2>
        <p className="text-gray-700 leading-relaxed">
          {t("about.thanks.description")}
        </p>
      </section>
    </div>
  )
}

export default About
