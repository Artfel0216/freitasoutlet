'use client';

'use client';

import React from 'react';
import Header from '../components/header/page';
import Contain from '@/app/components/contain/page';

// ... seus imports de imagens e arrays de produtos aqui

import SlipperAsunaAllBlack from "@/app/public/imgCalçados/ChineloAsunaAllBlack.jpg";
import SlipperAsunaBeige from "@/app/public/imgCalçados/ChineloAsunabege.jpg";
import SlipperAsunaGray from "@/app/public/imgCalçados/ChineloAsunaCinza.jpg";
import SlipperAsunaBlack from '@/app/public/imgCalçados/ChineloAsunaPreto.jpg';
import SneakersVansAllBlack from '@/app/public/imgCalçados/TenisVansAllBlack.jpg';
import SneakersVansAllWhite from '@/app/public/imgCalçados/TenisVansAllWhite.jpg';
import SneakersVansBrown from '@/app/public/imgCalçados/TenisVansBrown.jpg';
import SneakersVansBlack from '@/app/public/imgCalçados/TenisVansBlack.jpg';
import SneakersAirForceAllBlack from '@/app/public/imgCalçados/TênisNikeAirForceLinhaPremiumBlack.jpg';
import SneakersAirForceAllWhite from '@/app/public/imgCalçados/TênisNikeAirForceLinhaPremiumWhite.jpg';
import SneakersAirForceLinhaPremiumstringBlack from '@/app/public/imgCalçados/Tênis NikeAirForceLinhaPremiumCordaPreta.jpg'
import SneakersAirForceLinhaPremiumstringWhite from '@/app/public/imgCalçados/Tênis NikeAirForceLinhaPremiumCordaBranca.jpg';
import SneakersAdidasSamba from '@/app/public/imgCalçados/AdidasSamba.jpg';
import SneakersAdidasSambaSolado from '@/app/public/imgCalçados/AdidasSambaSol.jpg';
import SneakersAdidasAdSport from '@/app/public/imgCalçados/TenisAdidasAdSport.jpg';
import SneakersAdidasAdSportSolado from '@/app/public/imgCalçados/TenisAdidasAdSport2.jpg';
import SneakersAdidasAdSportWhite from '@/app/public/imgCalçados/TenisAdidasAdSportWhite.jpg';
import SneakersLV from '@/app/public/imgCalçados/TênisLouisVuittonTrainerLinhaPremium .jpg';
import SneakersLV2 from '@/app/public/imgCalçados/TênisLouisVuittonTrainerLinhaPremiumBlacAndWhite.jpg';
import SneakersLV3 from '@/app/public/imgCalçados/TênisLouisVuittonTrainerLinhaPremiumBlack.jpg';
import SneakersLV4 from '@/app/public/imgCalçados/TênisLouisVuittonTrainerLinhaPremiumBlue.jpg';
import AdidasCampusBlackAndWhite from '@/app/public/imgCalçados/AdidasCampusBlackAndWhite.jpg';
import AdidasCampusAllBlack from '@/app/public/imgCalçados/AdidasCampusAllBlack.jpg';
import AdidasCampusBege from '@/app/public/imgCalçados/AdidasCampusBege.jpg';
import MizunoProAllBlack from '@/app/public/imgCalçados/MizunoProAllBlack.jpg';
import MizunoProBlack from '@/app/public/imgCalçados/MizunoProBlack.jpg';
import MizunoProBlackAndGreen from '@/app/public/imgCalçados/MizunoProBlackAndGreen.jpg';
import MizunoProBlue from '@/app/public/imgCalçados/MizunoProBlue.jpg';
import MizunoProPurple from '@/app/public/imgCalçados/MizunoProPurple.jpg';



// Product data
const AsunaSlippers = [
  {
    src: SlipperAsunaAllBlack.src,
    alt: 'Asuna Slipper All black'
  },
  {
    src: SlipperAsunaBeige.src,
    alt: 'Asuna Slipper Beige'
  },
  {
    src: SlipperAsunaGray.src,
    alt: 'Asuna Slipper Gray'
  },
  {
    src: SlipperAsunaBlack.src,
    alt: 'Asuna Slipper Black And white'
  }   
];

const VansSneakers = [
  {
    src: SneakersVansAllBlack.src,
    alt: 'Vans VR3 Neo All Black Sneakers'
  },
  {
    src: SneakersVansAllWhite.src,
    alt: 'Vans VR3 Neo White Sneakers'
  },
  {
    src: SneakersVansBlack.src,
    alt: 'Vans VR3 Neo Black Sneakers'
  },
  {
    src: SneakersVansBrown.src,
    alt: 'Vans VR3 Neo Brown Sneakers'
  }

];

const AirForceSneakers = [
  {
    src: SneakersAirForceAllBlack.src,
    alt: 'Nike Air Force All Black',
  },
  {
    src: SneakersAirForceAllWhite.src,
    alt: 'Nike Air Force White',
  },
  {
    src: SneakersAirForceLinhaPremiumstringBlack.src,
    alt: 'Nike Air Force Black with String',
  },
  {
    src: SneakersAirForceLinhaPremiumstringWhite.src,
    alt: 'Nike Air Force White with String',
  }
  
]

const AdidasSneakersSamba = [
  {
    src: SneakersAdidasSamba.src,
    alt: 'Adidas Samba',
  },
  {
    src: SneakersAdidasSambaSolado.src,
    alt: '',
  }
]

const AdidasSneakersAdSport = [
  {
    src: SneakersAdidasAdSport.src,   
    alt: 'Adidas AdSport Black',
  },
  {
    src: SneakersAdidasAdSportSolado.src,
    alt: 'Adidas AdSport Black',
  },
  {
    src: SneakersAdidasAdSportWhite.src,
    alt: 'Adidas AdSport White',
  }
]

const LVSneakers = [
  {
    src: SneakersLV.src,  
    alt: 'Louis Vuitton Trainer',
  },
  {
    src: SneakersLV2.src,
    alt: 'Louis Vuitton Trainer',
  },
  {
    src: SneakersLV3.src,
    alt: 'Louis Vuitton Trainer',
  },
  {
    src: SneakersLV4.src,

    alt: 'Louis Vuitton Trainer',
  }
]

const AdidasCampus = [
  {
    src: AdidasCampusBlackAndWhite.src,
    alt: 'Adidas Campus Black and White',
  },
  {
    src: AdidasCampusAllBlack.src,
    alt: 'Adidas Campus All Black',
  },
  {
    src: AdidasCampusBege.src,
    alt: 'Adidas Campus Beige',
  }
]

const MizunoPro = [
  {
    src: MizunoProAllBlack.src,
    alt: 'Mizuno Pro All Black',
  },
  {
    src: MizunoProBlack.src,
    alt: 'Mizuno Pro Black',
  },
  {
    src: MizunoProBlackAndGreen.src,
    alt: 'Mizuno Pro Black and Green',
  },
  {
    src: MizunoProBlue.src,
    alt: 'Mizuno Pro Blue',
  },
  {
    src: MizunoProPurple.src,
    alt: 'Mizuno Pro Purple',
  }
]


// Main page
export default function BoyPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Divider */}
      <div className="w-full h-[1px] bg-gray-500"></div>

      {/* Main content */}
      <div className="min-h-screen bg-black p-8">
        <main className="flex gap-2 items-center justify-center">
          <Contain
            sneakers={AsunaSlippers}
            title=''
            price="R$ 187,50"
          />
          <Contain
            sneakers={VansSneakers}
            title=""
            price="R$ 125,00"
          />
          <Contain
            sneakers={AirForceSneakers}
            title=""
            price="R$ 107,50"
          />
        </main>
        
        <main className='flex gap-2 items-center justify-center'>
          <Contain 
           sneakers={LVSneakers}
            title=""
            price="R$ 212,50"
          />

          <Contain 
            sneakers={AdidasSneakersSamba}
            title=""
            price="R$ 100,00"
          /> 

          <Contain 
            sneakers={AdidasSneakersAdSport}
            title=""
            price="R$ 107,50"
          />
        </main>

         <main className='flex gap-2 items-center justify-center'>
          <Contain 
           sneakers={AdidasCampus}
            title=""
            price="R$ 107,50"
          />

          <Contain 
            sneakers={MizunoPro}
            title=""
            price="R$ 125,00"
          /> 

          <Contain 
            sneakers={AdidasSneakersAdSport}
            title=""
            price="R$ 86,00"
          />
        </main>

        <main className="flex gap-2 items-center justify-center">
        </main>
      </div>
    </div>
  );
}
