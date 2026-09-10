/**
 * References & Acknowledgements:
 * - Dataset Reference: City of Melbourne Urban Forest & VicFlora Database (https://vicflora.rbg.vic.gov.au/)
 * - Purpose: Realistic botanical data representing indigenous Melbourne flora for biodiversity corridor restoration.
 */

// Greater Melbourne Indigenous Flora Dataset (BR B.2 Dynamic Data)
export const initialPlants = [
  {
    id: 'plant-1',
    name: 'Golden Wattle',
    scientificName: 'Acacia pycnantha',
    imageUrl: 'https://cdn.sci.news/images/enlarge10/image_11399e-Acacia-pycnantha.jpg',
    category: 'Tree',
    sunExposure: 'Full Sun',
    waterNeeds: 'Low (Drought Hardy)',
    wildlifeBenefit: 'Native Bees & Parrots',
    stock: 25,
    adoptedCount: 5,
    description: 'Australia\'s floral emblem. Bright golden fragrant blooms providing abundant winter pollen for pollinators and seeds for native birds.'
  },
  {
    id: 'plant-2',
    name: 'Silver Banksia',
    scientificName: 'Banksia marginata',
    imageUrl: 'https://www.plantsforspaces.com.au/wp-content/uploads/2021/06/0242832_banksia-marginata-30cm.jpg',
    category: 'Shrub',
    sunExposure: 'Full Sun to Part Shade',
    waterNeeds: 'Low',
    wildlifeBenefit: 'Honeyeaters & Sugar Gliders',
    stock: 18,
    adoptedCount: 8,
    description: 'Essential nectar-producing Banksia with yellow cones, flowering throughout autumn and winter when food is scarce.'
  },
  {
    id: 'plant-3',
    name: 'Common Correa',
    scientificName: 'Correa reflexa',
    imageUrl: 'https://garden.org/pics/2017-12-08/carolem/5ea1c7.jpg',
    category: 'Shrub',
    sunExposure: 'Partial Shade',
    waterNeeds: 'Medium',
    wildlifeBenefit: 'Eastern Spinebills & Small Birds',
    stock: 30,
    adoptedCount: 12,
    description: 'Known as the Native Fuchsia. Pendulous red and green bell flowers thriving in shaded suburban garden beds.'
  },
  {
    id: 'plant-4',
    name: 'Kangaroo Grass',
    scientificName: 'Themeda triandra',
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.yS0G6VXEs8wRUQg_T8H3vgHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'Grass',
    sunExposure: 'Full Sun',
    waterNeeds: 'Very Low',
    wildlifeBenefit: 'Butterflies & Ground Finches',
    stock: 40,
    adoptedCount: 15,
    description: 'Iconic Australian native tussock grass with striking copper-colored seed heads, providing ground habitat for small fauna.'
  },
  {
    id: 'plant-5',
    name: 'Sweet Bursaria',
    scientificName: 'Bursaria spinosa',
    imageUrl: 'https://wsbn.org.au/wp-content/uploads/2019/09/Bursaria-spinosaVB.jpg',
    category: 'Shrub',
    sunExposure: 'Full Sun to Part Shade',
    waterNeeds: 'Low',
    wildlifeBenefit: 'Eltham Copper Butterfly',
    stock: 15,
    adoptedCount: 4,
    description: 'Critical host plant for the endangered Eltham Copper Butterfly. Produces creamy sweet-scented summer blossom clusters.'
  },
  {
    id: 'plant-6',
    name: 'Chocolate Lily',
    scientificName: 'Arthropodium strictum',
    imageUrl: 'https://images-sp.summitpost.org/tr:e-sharpen,e-contrast-1,fit-max,q-60,h-800/419766.JPG',
    category: 'Wildflower',
    sunExposure: 'Full Sun',
    waterNeeds: 'Medium',
    wildlifeBenefit: 'Pollinating Insects',
    stock: 20,
    adoptedCount: 6,
    description: 'Delicate violet wildflowers with a distinctive sweet chocolate aroma. Highly popular in native cottage gardens.'
  },
  {
    id: 'plant-7',
    name: 'Austral Indigo',
    scientificName: 'Indigofera australis',
    imageUrl: 'https://www.theseedcollection.com.au/assets/full/A7-18.jpg?20211104112650',
    category: 'Shrub',
    sunExposure: 'Full Sun to Part Shade',
    waterNeeds: 'Low',
    wildlifeBenefit: 'Native Bees & Caterpillars',
    stock: 22,
    adoptedCount: 3,
    description: 'Attractive native shrub producing sprays of mauve-pink pea flowers in spring, enriching garden soil nitrogen.'
  },
  {
    id: 'plant-8',
    name: 'Running Postman',
    scientificName: 'Kennedia prostrata',
    imageUrl: 'https://www.theseedcollection.com.au/assets/full/A5-18.jpg?20211105114746',
    category: 'Wildflower',
    sunExposure: 'Full Sun to Dappled Shade',
    waterNeeds: 'Low',
    wildlifeBenefit: 'Honeyeaters & Robins',
    stock: 28,
    adoptedCount: 7,
    description: 'Vibrant scarlet groundcover with clover-like foliage, excellent for suppressing weeds and providing ground nectar.'
  },
  {
    id: 'plant-9',
    name: 'Hop Goodenia',
    scientificName: 'Goodenia ovata',
    imageUrl: 'https://swanbayenvironment.org.au/wp-content/uploads/2020/07/Goodenia-ovata-Hop-Goodenia-Flower-and-Leaf-1184x1558.jpg',
    category: 'Shrub',
    sunExposure: 'Full Sun to Shade',
    waterNeeds: 'Medium',
    wildlifeBenefit: 'Butterflies & Hoverflies',
    stock: 35,
    adoptedCount: 9,
    description: 'Fast-growing hardy shrub with bright yellow fan-shaped flowers blooming across most of the year in Melbourne.'
  },
  {
    id: 'plant-10',
    name: 'Spiny-headed Mat-rush',
    scientificName: 'Lomandra longifolia',
    imageUrl: 'https://ausemade.com.au/wp-content/uploads/mat-rush-lomandra-longifolia-20221007_072915-sam1-1024x762.jpg',
    category: 'Grass',
    sunExposure: 'Full Sun to Deep Shade',
    waterNeeds: 'Very Low (Extremely Tough)',
    wildlifeBenefit: 'Lizards & Small Lizards',
    stock: 50,
    adoptedCount: 18,
    description: 'Virtually indestructible native strappy rush with fragrant yellow flower spikes, ideal for borders and erosion control.'
  },
  {
    id: 'plant-11',
    name: 'Common Tussock Grass',
    scientificName: 'Poa labillardierei',
    imageUrl: 'https://nativeplantproject.com.au/wp-content/uploads/2020/06/common-tussock-grass-poa-labillardieri-1-1-470x707.jpg',
    category: 'Grass',
    sunExposure: 'Full Sun to Part Shade',
    waterNeeds: 'Low to Medium',
    wildlifeBenefit: 'Skipper Butterflies',
    stock: 30,
    adoptedCount: 11,
    description: 'Graceful green tussocks with fine weeping foliage, creating safe shelter for frogs and ground foraging birds.'
  },
  {
    id: 'plant-12',
    name: 'Blackwood Wattle',
    scientificName: 'Acacia melanoxylon',
    imageUrl: 'https://www.thetutuguru.com.au/wp-content/uploads/2018/02/Hello-Hello-Plants-Nursery-Melbourne-Victoria-Australia-Acacia-melanoxylon-Blackwood-Wattle-Flowers-1200x900.jpg',
    category: 'Tree',
    sunExposure: 'Full Sun to Part Shade',
    waterNeeds: 'Medium',
    wildlifeBenefit: 'Yellow-tailed Black Cockatoos',
    stock: 12,
    adoptedCount: 2,
    description: 'Handsome shade tree with pale cream blossoms, attracting birds that feed on wood-boring insects and seed pods.'
  }
]