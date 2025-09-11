'use client';

import Header from "../components/header/page";
import Contain from '@/app/components/contain/page';

// ===================
// Importing Images
// ===================

// New Balance
import NewBalanceNewBeige from '@/app/public/imgCalcadosWoman/NewBalanceNewBeige.jpg';
import NewBalanceNewBlackAndWhite from '@/app/public/imgCalcadosWoman/NewBalanceNewBlackAndWhite.jpg';
import NewBalanceNewWhite from '@/app/public/imgCalcadosWoman/NewBalanceNewWhite.jpg';

// Nike Skate
import NikeSkateAllBlack from '@/app/public/imgCalcadosWoman/NikeSkateAllBlack.jpg';
import NikeSkateBlackAndWhite from '@/app/public/imgCalcadosWoman/NikeSkateBlackandWhite.jpg';
import NikeSkateWhite from '@/app/public/imgCalcadosWoman/NikeSkateWhite.jpg';
import NikeSkateBlack from '@/app/public/imgCalcadosWoman/NikeSkateBlack.jpg';

// Puma Palermo
import PumaPalermoBlackAndWhite from '@/app/public/imgCalcadosWoman/PumaPalermoBalckAndWhite.jpg';
import PumaPalermoWhite from '@/app/public/imgCalcadosWoman/PumaPalermoWhite.jpg';
import PumaPalermoBeige from '@/app/public/imgCalcadosWoman/PumaPalermoBeige.jpg';
import PumaPalermoBrown from '@/app/public/imgCalcadosWoman/PumaPalermoBrown .jpg';

// Puma Sneakers
import SneakersPumaBeige from '@/app/public/imgCalcadosWoman/SneakersPumaBeige.jpg';
import SneakersPumaBlackAndWhite from '@/app/public/imgCalcadosWoman/SneakersPumaBlackAndWhite.jpg';
import SneakersPumaWhite from '@/app/public/imgCalcadosWoman/SneakersPumaWhite.jpg';

// Vans Hylane
import VansHylaneBlack from '@/app/public/imgCalcadosWoman/VansHylaneBlack.jpg';
import VansHylaneBlackAndWhite from '@/app/public/imgCalcadosWoman/VansHylaneBlackAndWhite.jpg';
import VansHylaneWhite from '@/app/public/imgCalcadosWoman/VansHylaneWhite.jpg';
import VansHylaneWhite2 from '@/app/public/imgCalcadosWoman/VansHylaneWhite2.jpg';

// Adidas Samba
import AdidasSambaBlackAndWhite from '@/app/public/imgCalcadosWoman/AdidasSambaBlackAndWhite.jpg';
import AdidasSambaWhite from '@/app/public/imgCalcadosWoman/AdidasSambaWhite.jpg';
import AdidasSambaBrown from '@/app/public/imgCalcadosWoman/AdidasSambaBrown.jpg';

// Nike Air Force
import NikeAirForceBeige from '@/app/public/imgCalcadosWoman/NikeAirForceBeige.jpg';
import NikeAirForceBlue from '@/app/public/imgCalcadosWoman/NikeAirForceBlue.jpg';
import NikeAirForcePurple from '@/app/public/imgCalcadosWoman/NikeAirForcePurple.jpg';

// Vans Upland
import VansUplandBeige from '@/app/public/imgCalcadosWoman/VansUplandBeige.jpg';
import VansUplandBlackAndWhite from '@/app/public/imgCalcadosWoman/VansUplandBlackAndWhite.jpg';
import VansUplandWhite from '@/app/public/imgCalcadosWoman/VansUplandWhite.jpg';


// ===================
// Product Data
// ===================

const NewBalanceNew = [
  { src: NewBalanceNewBeige.src, alt: 'New Balance New Beige' },
  { src: NewBalanceNewBlackAndWhite.src, alt: 'New Balance New Black And White' },
  { src: NewBalanceNewWhite.src, alt: 'New Balance New White' }
];

const NikeSkate = [
  { src: NikeSkateAllBlack.src, alt: 'Nike Skate All Black' },
  { src: NikeSkateBlackAndWhite.src, alt: 'Nike Skate Black And White' },
  { src: NikeSkateWhite.src, alt: 'Nike Skate White' },
  { src: NikeSkateBlack.src, alt: 'Nike Skate Black' }
];

const PumaPalermo = [
  { src: PumaPalermoBlackAndWhite.src, alt: 'Puma Palermo Black And White' },
  { src: PumaPalermoWhite.src, alt: 'Puma Palermo White' },
  { src: PumaPalermoBeige.src, alt: 'Puma Palermo Beige' },
  { src: PumaPalermoBrown.src, alt: 'Puma Palermo Brown' }
];

const SneakersPuma = [
  { src: SneakersPumaBeige.src, alt: 'Sneakers Puma Beige' },
  { src: SneakersPumaBlackAndWhite.src, alt: 'Sneakers Puma Black And White' },
  { src: SneakersPumaWhite.src, alt: 'Sneakers Puma White' }
];

const VansHylane = [
  { src: VansHylaneBlack.src, alt: 'Vans Hylane Black' },
  { src: VansHylaneBlackAndWhite.src, alt: 'Vans Hylane Black And White' },
  { src: VansHylaneWhite.src, alt: 'Vans Hylane White' },
  { src: VansHylaneWhite2.src, alt: 'Vans Hylane White 2' }
];

const AdidasSamba = [
  { src: AdidasSambaBlackAndWhite.src, alt: 'Adidas Samba Black And White' },
  { src: AdidasSambaWhite.src, alt: 'Adidas Samba White' },
  { src: AdidasSambaBrown.src, alt: 'Adidas Samba Brown' }
];

const NikeAirForce = [
  { src: NikeAirForceBeige.src, alt: 'Nike Air Force Beige' },
  { src: NikeAirForceBlue.src, alt: 'Nike Air Force Blue' },
  { src: NikeAirForcePurple.src, alt: 'Nike Air Force Purple' }
];

const VansUpland = [
  { src: VansUplandBeige.src, alt: 'Vans Upland Beige' },
  { src: VansUplandBlackAndWhite.src, alt: 'Vans Upland Black And White' },
  { src: VansUplandWhite.src, alt: 'Vans Upland White' }
];


// ===================
// Home Page
// ===================

export default function WomanPage() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Divider */}
      <div className="w-full h-[1px] bg-gray-500"></div>

      {/* Content */}
      <div className="min-h-screen bg-black p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center">
          <Contain sneakers={NewBalanceNew} title="" price="R$ 107,50" />
          <Contain sneakers={NikeSkate} title="" price="R$ 199,90" />
          <Contain sneakers={PumaPalermo} title="" price="R$ 179,90" />

          <Contain sneakers={SneakersPuma} title="" price="R$ 149,90" />
          <Contain sneakers={VansHylane} title="" price="R$ 249,90" />
          <Contain sneakers={AdidasSamba} title="" price="R$ 179,90" />

          <Contain sneakers={NikeAirForce} title="" price="R$ 299,90" />
          <Contain sneakers={VansUpland} title="" price="R$ 219,90" />
        </div>
      </div>
    </div>
  );
}
