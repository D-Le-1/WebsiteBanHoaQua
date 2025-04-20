import { useTranslation } from "react-i18next"

function Sort({sortOption, handleSortChange}){
  const {t} = useTranslation()
  return(
    <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-gray-700">
                  {t('sort.Sort')}
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                  <option value="default">{t('sort.links.0')}</option>
                  <option value="price-asc">{t('sort.links.1')}</option>
                  <option value="price-desc">{t('sort.links.2')}</option>
                  <option value="name-asc">A-Z</option>
                  <option value="name-desc">Z-A</option>
            </select>
        </div>
  )
}

export default Sort