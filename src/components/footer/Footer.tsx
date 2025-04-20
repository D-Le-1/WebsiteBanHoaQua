import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn
} from "react-icons/fa"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

const Footer = () => {
  const {t} = useTranslation()
  return (
    <footer className="bg-orange-100 text-black py-10 px-5 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Exclusive Section */}
        <div>
          <h3 className="text-xl font-bold">FreshFruit</h3>
          <div className="mt-3 space-y-3">
            <p className="mt-3 font-bold">{t('exclusive.subscribe')}</p>
            <p className="text-sm">{t('exclusive.description')}</p>
            <div className="mt-3 flex items-center border border-gray-400 rounded-md overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 flex-1 bg-black text-white focus:outline-none"
              />
              <button className="bg-white text-black p-2">&gt;</button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-semibold">{t('supports.title')}</h3>
          <div className="mt-3 space-y-3">
            <p className="mt-3 text-sm">
              {t('supports.address')}
            </p>
            <p className="text-sm">exclusive@gmail.com</p>
            <p className="text-sm">+88015-88888-9999</p>
          </div>
        </div>

        {/* Account Section */}
        <div>
          <h3 className="text-lg font-semibold">{t('account.title')}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li>{t('account.links.0')}</li>
            <li>{t('account.links.1')}</li>
            <li>{t('account.links.2')}</li>
            <li>{t('account.links.3')}</li>
            <li>{t('account.links.4')}</li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-lg font-semibold">{t('quick_link.title')}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li>{t('quick_link.links.0')}</li>
            <li>{t('quick_link.links.1')}</li>
            <li>{t('quick_link.links.2')}</li>
            <li>{t('quick_link.links.3')}</li>
          </ul>
        </div>

        {/* Download App Section */}
        <div>
          <h3 className="text-lg font-semibold">{t('download_app.title')}</h3>
          <p className="mt-3 text-sm">{t('download_app.description')}</p>
          <div className="flex space-x-2 mt-3">
            <img src="\images\qrcode.jpg" alt="QR Code" className="h-16" />
            <div className="space-y-2">
              <Link>
                <img
                  src="\images\ggplay.png"
                  alt="Google Play"
                  className="h-10"
                />
              </Link>
              <Link>
                <img src="\images\appst.png" alt="App Store" className="h-10" />
              </Link>
            </div>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-5">
            <FaFacebookF className="cursor-pointer" />
            <FaTwitter className="cursor-pointer" />
            <FaInstagram className="cursor-pointer" />
            <FaLinkedinIn className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-center text-sm border-t border-gray-600 pt-5">
        <p>&copy; {t('download_app.copyright')}</p>
      </div>
    </footer>
  )
}

export default Footer
