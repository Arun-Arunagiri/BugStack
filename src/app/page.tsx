import React from 'react'
import Link from 'next/link'
import { Seymour_One, Inter } from 'next/font/google';

const seymourOne = Seymour_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});
const inter = Inter({
  weight: '400',
  subsets: ['latin'],
  display: 'swap'
})

function page() {
  return (
    <div className="flex flex-col items-center justify-center-safe min-h-screen gap-5 bg-white bg-repeat bg-[length:6px_6px] [background-image:url('data:image/svg+xml,%3Csvg%20width%3D%276%27%20height%3D%276%27%20viewBox%3D%270%200%206%206%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Cg%20fill%3D%27%237b32f0%27%20fill-opacity%3D%270.4%27%20fill-rule%3D%27evenodd%27%3E%3Cpath%20d%3D%27M5%200h1L0%206V5zM6%205v1H5z%27/%3E%3C/g%3E%3C/svg%3E')]">
      <p className={`text-blue-500 text-4xl lg:text-8xl ${seymourOne.className}`}>BugStack</p>
      <p className={`text-black text-2xl lg:text-4xl ${inter.className}`}>One place to debug your dev life.</p>
      <Link href={'/login'} className={`bg-green-500 text-white  ${inter.className} text-2xl px-5 py-3 rounded-2xl lg:rounded-3xl hover:bg-green-700 transition-colors duration-300 shadow-sm`}>Get Started!</Link>
    </div>

  )
}

export default page