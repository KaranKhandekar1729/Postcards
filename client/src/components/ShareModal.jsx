import { useState } from "react"
import { createPortal } from "react-dom"
import { Check, Copy } from "lucide-react"

export default function ShareModal({ onClose }) {
  const [copy, setCopy] = useState(false)
  const openWhatsapp = () => {
    window.open(`https://api.whatsapp.com/send?text=${window.location.href}`, '_blank')
  }
  const openFacebook = () => {
    window.open(`https://facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')
  }
  const openMail = () => {
    window.open(`mailto:?subject=&body=Check%20out%20this%20link:${window.location.href}`, '_blank')
  }
  const openTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.href}`)
    setCopy(true)
    setTimeout(() => setCopy(false), 500)
  }

  return (
    createPortal(
      <>
        <div onClick={onClose} className='absolute inset-0 flex justify-center items-center bg-black/50 z-1'></div>
        <div className="absolute z-2 inset-0 h-fit p-6 sm:p-8 bg-red-950 rounded-md w-[90%] sm:w-fit flex flex-col gap-8 m-auto">
          <img src="https://res.cloudinary.com/docidcbkt/image/upload/v1782125936/g5hgkcuz0wwbcz3mrekm.webp" className="w-40 m-auto" alt="" />
          <div className="flex gap-8 justify-center">
            <button
              onClick={openWhatsapp}
              className="cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40px" height="40px" viewBox="-2.73 0 1225.016 1225.016"><path fill="#E0E0E0" d="M1041.858 178.02C927.206 63.289 774.753.07 612.325 0 277.617 0 5.232 272.298 5.098 606.991c-.039 106.986 27.915 211.42 81.048 303.476L0 1225.016l321.898-84.406c88.689 48.368 188.547 73.855 290.166 73.896h.258.003c334.654 0 607.08-272.346 607.222-607.023.056-162.208-63.052-314.724-177.689-429.463zm-429.533 933.963h-.197c-90.578-.048-179.402-24.366-256.878-70.339l-18.438-10.93-191.021 50.083 51-186.176-12.013-19.087c-50.525-80.336-77.198-173.175-77.16-268.504.111-278.186 226.507-504.503 504.898-504.503 134.812.056 261.519 52.604 356.814 147.965 95.289 95.36 147.728 222.128 147.688 356.948-.118 278.195-226.522 504.543-504.693 504.543z" /><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="609.77" y1="1190.114" x2="609.77" y2="21.084"><stop offset="0" stop-color="#20b038" /><stop offset="1" stop-color="#60d66a" /></linearGradient><path fill="url(#a)" d="M27.875 1190.114l82.211-300.18c-50.719-87.852-77.391-187.523-77.359-289.602.133-319.398 260.078-579.25 579.469-579.25 155.016.07 300.508 60.398 409.898 169.891 109.414 109.492 169.633 255.031 169.57 409.812-.133 319.406-260.094 579.281-579.445 579.281-.023 0 .016 0 0 0h-.258c-96.977-.031-192.266-24.375-276.898-70.5l-307.188 80.548z" /><image overflow="visible" opacity=".08" width="682" height="639" xlink:href="FCC0802E2AF8A915.png" transform="translate(270.984 291.372)" /><path fill-rule="evenodd" clip-rule="evenodd" fill="#FFF" d="M462.273 349.294c-11.234-24.977-23.062-25.477-33.75-25.914-8.742-.375-18.75-.352-28.742-.352-10 0-26.25 3.758-39.992 18.766-13.75 15.008-52.5 51.289-52.5 125.078 0 73.797 53.75 145.102 61.242 155.117 7.5 10 103.758 166.266 256.203 226.383 126.695 49.961 152.477 40.023 179.977 37.523s88.734-36.273 101.234-71.297c12.5-35.016 12.5-65.031 8.75-71.305-3.75-6.25-13.75-10-28.75-17.5s-88.734-43.789-102.484-48.789-23.75-7.5-33.75 7.516c-10 15-38.727 48.773-47.477 58.773-8.75 10.023-17.5 11.273-32.5 3.773-15-7.523-63.305-23.344-120.609-74.438-44.586-39.75-74.688-88.844-83.438-103.859-8.75-15-.938-23.125 6.586-30.602 6.734-6.719 15-17.508 22.5-26.266 7.484-8.758 9.984-15.008 14.984-25.008 5-10.016 2.5-18.773-1.25-26.273s-32.898-81.67-46.234-111.326z" /><path fill="#FFF" d="M1036.898 176.091C923.562 62.677 772.859.185 612.297.114 281.43.114 12.172 269.286 12.039 600.137 12 705.896 39.633 809.13 92.156 900.13L7 1211.067l318.203-83.438c87.672 47.812 186.383 73.008 286.836 73.047h.255.003c330.812 0 600.109-269.219 600.25-600.055.055-160.343-62.328-311.108-175.649-424.53zm-424.601 923.242h-.195c-89.539-.047-177.344-24.086-253.93-69.531l-18.227-10.805-188.828 49.508 50.414-184.039-11.875-18.867c-49.945-79.414-76.312-171.188-76.273-265.422.109-274.992 223.906-498.711 499.102-498.711 133.266.055 258.516 52 352.719 146.266 94.195 94.266 146.031 219.578 145.992 352.852-.118 274.999-223.923 498.749-498.899 498.749z" /></svg>
            </button>
            <button
              onClick={openFacebook}
              className="cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7208)" /><path d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z" fill="white" /><defs><linearGradient id="paint0_linear_87_7208" x1="16" y1="2" x2="16" y2="29.917" gradientUnits="userSpaceOnUse"><stop stop-color="#18ACFE" /><stop offset="1" stop-color="#0163E0" /></linearGradient></defs></svg>
            </button>
            <button
              onClick={openTwitter}
              className="cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 201 201" fill="none"><path d="M200.448 100.651C200.448 151.17 163.011 192.936 114.377 199.713C109.83 200.344 105.177 200.674 100.455 200.674C95.0035 200.674 89.6504 200.239 84.4373 199.398C36.8266 191.73 0.461731 150.435 0.461731 100.651C0.461731 45.4078 45.2347 0.621582 100.462 0.621582C155.689 0.621582 200.462 45.4078 200.462 100.651H200.448Z" fill="#1C1C1B" /><path d="M41.0167 44.7349L87.1349 106.412L40.7294 156.56H51.1765L91.8085 112.657L124.635 156.56H160.18L111.469 91.4134L154.666 44.7349H144.219L106.803 85.1686L76.5688 44.7349H41.0236H41.0167ZM56.3754 52.4305H72.7011L144.807 148.864H128.482L56.3754 52.4305Z" fill="white" /></svg>
            </button>
            <button
              onClick={openMail}
              className="cursor-pointer"
            >
              <img width={44} src="https://img.icons8.com/fluency/48/gmail.png" alt="gmail" />
            </button>
          </div>
          <div className="flex border border-[#cccccc30] bg-transparent p-4 rounded-md">
            <div className="flex-1 text-left pr-2 border-r-2 border-[#cccccc30] min-w-0 w-2 text-white overflow-hidden text-ellipsis whitespace-nowrap">{window.location.href}</div>
            <button onClick={copyLink} className="text-white shrink-0 ml-2 m-auto cursor-pointer">
              {copy ? (<Check size="18" />) : (<Copy size="18" />)}
            </button>
          </div>
        </div>
      </>,
      document.getElementById('share-modal')
    )
  )
}
