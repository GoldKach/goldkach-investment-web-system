import { BookA } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Logo() {
  return (
    <div>
         <Link href={"/"} className="flex items-center space-x-2">
              <div className=" p-1">
                <span className="text-white font-bold text-xl">
                  <Image src="/logos/GoldKach-Logo-New-3.png" width={40} height={40} alt='logo-goldkach'/>
                </span>
              </div>
            </Link>
    </div>
  )
}
