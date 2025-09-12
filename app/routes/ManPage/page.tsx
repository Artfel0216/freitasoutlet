'use client';

import React from 'react';
import Header from '@/app/components/header/page';
import Contain from '@/app/components/contain/page';

// ===================
// Importing Images
// ===================

// Slippers
import SlipperAsunaAllBlack from "@/app/public/imgCalçados/ChineloAsunaAllBlack.jpg";
import SlipperAsunaBeige from "@/app/public/imgCalçados/ChineloAsunabege.jpg";
import SlipperAsunaGray from "@/app/public/imgCalçados/ChineloAsunaCinza.jpg";
import SlipperAsunaBlack from '@/app/public/imgCalçados/ChineloAsunaPreto.jpg';

// Vans
import SneakersVansAllBlack from '@/app/public/imgCalçados/TenisVansAllBlack.jpg';
import SneakersVansAllWhite from '@/app/public/imgCalçados/TenisVansAllWhite.jpg';
import SneakersVansBrown from '@/app/public/imgCalçados/TenisVansBrown.jpg';
import SneakersVansBlack from '@/app/public/imgCalçados/TenisVansBlack.jpg';

// Nike Air Force
import SneakersAirForceAllBlack from '@/app/public/imgCalçados/TênisNikeAirForceLinhaPremiumBlack.jpg';
import SneakersAirForceAllWhite from '@/app/public/imgCalçados/TênisNikeAirForceLinhaPremiumWhite.jpg';
import SneakersAirForceLinhaPremiumstringBlack from '@/app/public/imgCalçados/Tênis NikeAirForceLinhaPremiumCordaPreta.jpg';
import SneakersAirForceLinhaPremiumstringWhite from '@/app/public/imgCalçados/Tênis NikeAirForceLinhaPremiumCordaBranca.jpg';

// Adidas
import SneakersAdidasSamba from '@/app/public/imgCalçados/AdidasSamba.jpg';
import SneakersAdidasSambaSolado from '@/app/public/imgCalçados/AdidasSambaSol.jpg';
import SneakersAdidasAdSport from '@/app/public/imgCalçados/TenisAdidasAdSport.jpg';
import SneakersAdidasAdSportSolado from '@/app/public/imgCalçados/TenisAdidasAdSport2.jpg';
import SneakersAdidasAdSportWhite from '@/app/public/imgCalçados/TenisAdidasAdSportWhite.jpg';
import AdidasCampusBlackAndWhite from '@/app/public/imgCalçados/AdidasCampusBlackAndWhite.jpg';
import AdidasCampusAllBlack from '@/app/public/imgCalçados/AdidasCampusAllBlack.jpg';
import AdidasCampusBege from '@/app/public/imgCalçados/AdidasCampusBege.jpg';

// Louis Vuitton
import SneakersLV from '@/app/public/imgCalçados/TênisLouisVuittonTrainerLinhaPremium .jpg';
import SneakersLV2 from '@/app/public/imgCalçados/TênisLouisVuittonTrainerLinhaPremiumBlacAndWhite.jpg';
import SneakersLV3 from '@/app/public/imgCalçados/TênisLouisVuittonTrainerLinhaPremiumBlack.jpg';
import SneakersLV4 from '@/app/public/imgCalçados/TênisLouisVuittonTrainerLinhaPremiumBlue.jpg';

// Mizuno
import MizunoProAllBlack from '@/app/public/imgCalçados/MizunoProAllBlack.jpg';
import MizunoProBlack from '@/app/public/imgCalçados/MizunoProBlack.jpg';
import MizunoProBlackAndGreen from '@/app/public/imgCalçados/MizunoProBlackAndGreen.jpg';
import MizunoProBlue from '@/app/public/imgCalçados/MizunoProBlue.jpg';
import MizunoProPurple from '@/app/public/imgCalçados/MizunoProPurple.jpg';

// Nike Alphafly
import NikeAirZoomAlphafly2GreenAndBlack from '@/app/public/imgCalçados/NikeAirZoomAlphafly2GreenAndBlack.jpg';
import NikeAirZoomAlphafly2GreenAndblue from '@/app/public/imgCalçados/NikeAirZoomAlphafly2GreenAndblue.jpg';
import NikeAirZoomAlphafly2Orange from '@/app/public/imgCalçados/NikeAirZoomAlphafly2Orange.jpg';
import NikeAirZoomAlphafly2WhiteAndOrange from '@/app/public/imgCalçados/NikeAirZoomAlphafly2WhiteAndOrange.jpg';
import NikeAirZoomAlphafly2WhiteAndPurple from '@/app/public/imgCalçados/NikeAirZoomAlphafly2WhiteAndPurple.jpg';
import NikeAirZoomAlphafly2WhiteAndRose from '@/app/public/imgCalçados/NikeAirZoomAlphafly2WhiteAndRose.jpg';
import NikeAirZoomAlphafly2WhiteFireRed from '@/app/public/imgCalçados/NikeAirZoomAlphafly2WhiteFire.jpg';


// ===================
// Product Data
// ===================

const AsunaSlippers = [
  { src: SlipperAsunaAllBlack.src, alt: 'Asuna Slipper All Black' },
  { src: SlipperAsunaBeige.src, alt: 'Asuna Slipper Beige' },
  { src: SlipperAsunaGray.src, alt: 'Asuna Slipper Gray' },
  { src: SlipperAsunaBlack.src, alt: 'Asuna Slipper Black And White' }
];

const VansSneakers = [
  { src: SneakersVansAllBlack.src, alt: 'Vans VR3 Neo All Black' },
  { src: SneakersVansAllWhite.src, alt: 'Vans VR3 Neo White' },
  { src: SneakersVansBlack.src, alt: 'Vans VR3 Neo Black' },
  { src: SneakersVansBrown.src, alt: 'Vans VR3 Neo Brown' }
];

const AirForceSneakers = [
  { src: SneakersAirForceAllBlack.src, alt: 'Nike Air Force All Black' },
  { src: SneakersAirForceAllWhite.src, alt: 'Nike Air Force White' },
  { src: SneakersAirForceLinhaPremiumstringBlack.src, alt: 'Nike Air Force Black with String' },
  { src: SneakersAirForceLinhaPremiumstringWhite.src, alt: 'Nike Air Force White with String' }
];

const AdidasSneakersSamba = [
  { src: SneakersAdidasSamba.src, alt: 'Adidas Samba' },
  { src: SneakersAdidasSambaSolado.src, alt: 'Adidas Samba Solado' }
];

const AdidasSneakersAdSport = [
  { src: SneakersAdidasAdSport.src, alt: 'Adidas AdSport Black' },
  { src: SneakersAdidasAdSportSolado.src, alt: 'Adidas AdSport Black Solado' },
  { src: SneakersAdidasAdSportWhite.src, alt: 'Adidas AdSport White' }
];

const LVSneakers = [
  { src: SneakersLV.src, alt: 'Louis Vuitton Trainer' },
  { src: SneakersLV2.src, alt: 'Louis Vuitton Trainer Black & White' },
  { src: SneakersLV3.src, alt: 'Louis Vuitton Trainer Black' },
  { src: SneakersLV4.src, alt: 'Louis Vuitton Trainer Blue' }
];

const AdidasCampus = [
  { src: AdidasCampusBlackAndWhite.src, alt: 'Adidas Campus Black and White' },
  { src: AdidasCampusAllBlack.src, alt: 'Adidas Campus All Black' },
  { src: AdidasCampusBege.src, alt: 'Adidas Campus Beige' }
];

const MizunoPro = [
  { src: MizunoProAllBlack.src, alt: 'Mizuno Pro All Black' },
  { src: MizunoProBlack.src, alt: 'Mizuno Pro Black' },
  { src: MizunoProBlackAndGreen.src, alt: 'Mizuno Pro Black and Green' },
  { src: MizunoProBlue.src, alt: 'Mizuno Pro Blue' },
  { src: MizunoProPurple.src, alt: 'Mizuno Pro Purple' }
];

const NikeAirZoomAlphafly2 = [
  { src: NikeAirZoomAlphafly2GreenAndBlack.src, alt: 'Nike Alphafly Green and Black' },
  { src: NikeAirZoomAlphafly2GreenAndblue.src, alt: 'Nike Alphafly Green and Blue' },
  { src: NikeAirZoomAlphafly2Orange.src, alt: 'Nike Alphafly Orange' },
  { src: NikeAirZoomAlphafly2WhiteAndOrange.src, alt: 'Nike Alphafly White and Orange' },
  { src: NikeAirZoomAlphafly2WhiteAndPurple.src, alt: 'Nike Alphafly White and Purple' },
  { src: NikeAirZoomAlphafly2WhiteAndRose.src, alt: 'Nike Alphafly White and Rose' },
  { src: NikeAirZoomAlphafly2WhiteFireRed.src, alt: 'Nike Alphafly White Fire Red' }
];


// ===================
// Home Page
// ===================

export default function BoyPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Divider */}
      <div className="w-full h-[1px] bg-gray-500"></div>

      {/* Content */}
      <div className="min-h-screen bg-black p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center">
          <Contain sneakers={AsunaSlippers} title="" price="R$ 187,50" />
          <Contain sneakers={VansSneakers} title="" price="R$ 125,00" />
          <Contain sneakers={AirForceSneakers} title="" price="R$ 107,50" />

          <Contain sneakers={LVSneakers} title="" price="R$ 212,50" />
          <Contain sneakers={AdidasSneakersSamba} title="" price="R$ 100,00" />
          <Contain sneakers={AdidasSneakersAdSport} title="" price="R$ 107,50" />

          <Contain sneakers={AdidasCampus} title="" price="R$ 107,50" />
          <Contain sneakers={MizunoPro} title="" price="R$ 125,00" />
          <Contain sneakers={NikeAirZoomAlphafly2} title="" price="R$ 950,00" />
        </div>
      </div>
    </div>
  );
}
