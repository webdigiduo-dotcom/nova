/**
 * Aurelia Estates — property & agent data
 * ------------------------------------------------------------
 * Single source of truth for listings. Every page that shows
 * properties (home, listings, detail) reads from this file.
 *
 * Field reference
 *   id          URL slug used by property.html?id=<id>
 *   type        "apartment" | "villa" | "plot" | "commercial"
 *   status      "sale" | "rent"
 *   price       Number in INR. For rentals this is the MONTHLY rent.
 *   area        Built-up / plot area in sq.ft
 *   badges      Any of "new", "featured"
 *   listedOn    ISO date — used for "Newest" sorting
 *   images      Unsplash photo IDs (see AURELIA_DATA.img helper) or full URLs
 *   agent       Key into the agents map below
 *
 * To add a listing: copy an object, give it a unique id, update fields.
 */
(function () {
  'use strict';

  /**
   * Build an image URL. Accepts an Unsplash photo ID ("photo-...")
   * or any absolute / relative URL (e.g. "images/my-home.jpg").
   */
  function img(src, width) {
    var w = width || 1600;
    if (/^(https?:)?\/\//.test(src) || src.indexOf('/') !== -1) return src;
    return 'https://images.unsplash.com/' + src + '?auto=format&fit=crop&w=' + w + '&q=80';
  }

  var agents = {
    meera: {
      name: 'Meera Kapoor',
      role: 'Founder & Principal Advisor',
      phone: '+91 98765 43210',
      email: 'meera@aureliaestates.com',
      photo: 'photo-1573496359142-b8d87734a5a2',
      bio: '18 years advising families and family offices on Mumbai’s most coveted addresses.'
    },
    arjun: {
      name: 'Arjun Malhotra',
      role: 'Director, North India',
      phone: '+91 98765 43211',
      email: 'arjun@aureliaestates.com',
      photo: 'photo-1560250097-0b93528c311a',
      bio: 'Specialist in Gurugram penthouses, land banking and commercial leasing.'
    },
    sanya: {
      name: 'Sanya Iyer',
      role: 'Director, South India',
      phone: '+91 98765 43212',
      email: 'sanya@aureliaestates.com',
      photo: 'photo-1580489944761-15a19d654956',
      bio: 'Leads our Bengaluru and Hyderabad desks with a focus on villas and gated communities.'
    },
    nikhil: {
      name: 'Nikhil D’Souza',
      role: 'Senior Advisor, West Coast',
      phone: '+91 98765 43213',
      email: 'nikhil@aureliaestates.com',
      photo: 'photo-1507003211169-0a1dd7228f2d',
      bio: 'Goa and Pune specialist — second homes, holiday rentals and boutique residences.'
    }
  };

  var properties = [
    {
      id: 'the-ivory-residence',
      title: 'The Ivory Residence',
      type: 'apartment',
      status: 'sale',
      price: 87500000,
      locality: 'Bandra West',
      city: 'Mumbai',
      address: 'Carter Road, Bandra West, Mumbai 400050',
      beds: 4, baths: 5, area: 3850,
      yearBuilt: 2022, parking: 3, furnishing: 'Semi-furnished',
      badges: ['featured'],
      listedOn: '2026-09-28',
      summary: 'Sea-facing luxury apartment with private elevator access.',
      description: [
        'Set high above Carter Road, The Ivory Residence frames uninterrupted views of the Arabian Sea from every principal room. A private elevator opens directly into a marble-clad foyer, leading to a 30-foot living and dining salon washed in western light.',
        'Four en-suite bedrooms include a primary suite with a walk-in dressing room and a spa bathroom finished in Italian Statuario. A chef’s kitchen with Gaggenau appliances, a separate service wing and three covered parking bays complete one of Bandra’s most private addresses.'
      ],
      amenities: ['Private elevator lobby', 'Uninterrupted sea views', 'Italian marble flooring', 'Gaggenau kitchen', 'Walk-in dressing room', 'Staff quarters', 'Clubhouse & infinity pool', '24/7 concierge & security', 'Power backup', 'Three covered parking bays'],
      images: ['photo-1545324418-cc1a3fa10c00', 'photo-1600210492486-724fe5c67fb0', 'photo-1600607687939-ce8a6c25118c', 'photo-1616594039964-ae9021a400a0', 'photo-1584622650111-993a426fbf0a'],
      agent: 'meera'
    },
    {
      id: 'willow-grove-villa',
      title: 'Willow Grove Villa',
      type: 'villa',
      status: 'sale',
      price: 62000000,
      locality: 'Whitefield',
      city: 'Bengaluru',
      address: 'Willow Grove Enclave, Whitefield, Bengaluru 560066',
      beds: 5, baths: 6, area: 5200,
      yearBuilt: 2024, parking: 4, furnishing: 'Unfurnished',
      badges: ['featured', 'new'],
      listedOn: '2026-10-12',
      summary: 'Gated villa with landscaped garden, pool, and smart-home automation.',
      description: [
        'Willow Grove Villa is a contemporary five-bedroom home set within one of Whitefield’s most established gated enclaves. Floor-to-ceiling glazing dissolves the boundary between the double-height living room and a landscaped garden with a 12-metre lap pool.',
        'The home is fully wired for smart living — lighting, climate, blinds and security can be controlled from a single app. A ground-floor guest suite, a home office and a basement media lounge give a growing family room to breathe.'
      ],
      amenities: ['Private 12 m lap pool', 'Landscaped garden', 'Smart-home automation', 'Double-height living room', 'Home office', 'Basement media lounge', 'Solar rooftop', 'EV charging', 'Gated community security', 'Four-car parking'],
      images: ['photo-1613490493576-7fde63acd811', 'photo-1600585154340-be6161a56a0c', 'photo-1600566753190-17f0baa2a6c3', 'photo-1556909114-f6e7ad7d3136', 'photo-1505691938895-1758d7feb511'],
      agent: 'sanya'
    },
    {
      id: 'the-meridian-penthouse',
      title: 'The Meridian Penthouse',
      type: 'apartment',
      status: 'sale',
      price: 114000000,
      locality: 'Golf Course Road',
      city: 'Gurugram',
      address: 'Sector 54, Golf Course Road, Gurugram 122011',
      beds: 4, baths: 5, area: 4600,
      yearBuilt: 2023, parking: 3, furnishing: 'Fully furnished',
      badges: ['featured'],
      listedOn: '2026-09-15',
      summary: 'Skyline penthouse with terrace lounge and panoramic city views.',
      description: [
        'Crowning one of Golf Course Road’s most recognised towers, The Meridian Penthouse spans the entire 38th floor. A wraparound terrace lounge with an outdoor kitchen and fire pit offers 270-degree views across the Aravalli ridge and the Gurugram skyline.',
        'Inside, a gallery-style corridor connects a formal living room, an intimate family lounge and four generous suites. Delivered fully furnished by a celebrated Delhi design studio, the residence is ready to move into.'
      ],
      amenities: ['Full-floor residence', 'Wraparound terrace lounge', 'Outdoor kitchen & fire pit', 'Designer furnishings', 'Private lift lobby', 'Wine room', 'Golf course views', 'Concierge & valet', 'Clubhouse & spa', 'Three reserved parking bays'],
      images: ['photo-1502672260266-1c1ef2d93688', 'photo-1600607687939-ce8a6c25118c', 'photo-1522708323590-d24dbb6b0267', 'photo-1616594039964-ae9021a400a0', 'photo-1584622650111-993a426fbf0a'],
      agent: 'arjun'
    },
    {
      id: 'cedar-court-apartments',
      title: 'Cedar Court Apartments',
      type: 'apartment',
      status: 'sale',
      price: 29500000,
      locality: 'Koregaon Park',
      city: 'Pune',
      address: 'Lane 6, Koregaon Park, Pune 411001',
      beds: 3, baths: 3, area: 2150,
      yearBuilt: 2025, parking: 2, furnishing: 'Semi-furnished',
      badges: ['featured', 'new'],
      listedOn: '2026-10-08',
      summary: 'Boutique residence near cafés, galleries, and business districts.',
      description: [
        'Cedar Court is a boutique collection of just twelve residences on a quiet, tree-lined lane in Koregaon Park. This three-bedroom home pairs warm oak floors with generous balconies overlooking a canopy of rain trees.',
        'The neighbourhood’s cafés, galleries and restaurants are a short stroll away, while the Kalyani Nagar and Viman Nagar business districts are within a fifteen-minute drive.'
      ],
      amenities: ['Boutique building of 12 homes', 'Engineered oak flooring', 'Twin balconies', 'Modular kitchen', 'Rooftop garden', 'Gym', 'Video door phone', 'Two covered parking bays'],
      images: ['photo-1560448204-e02f11c3d0e2', 'photo-1493809842364-78817add7ffb', 'photo-1600566753190-17f0baa2a6c3', 'photo-1505691938895-1758d7feb511'],
      agent: 'nikhil'
    },
    {
      id: 'azure-bay-villas',
      title: 'Azure Bay Villas',
      type: 'villa',
      status: 'sale',
      price: 48000000,
      locality: 'Assagao',
      city: 'Goa',
      address: 'Assagao, Bardez, North Goa 403507',
      beds: 4, baths: 4, area: 3400,
      yearBuilt: 2024, parking: 2, furnishing: 'Fully furnished',
      badges: ['featured'],
      listedOn: '2026-08-30',
      summary: 'Contemporary beachside villas with private plunge pools.',
      description: [
        'Azure Bay is a limited collection of contemporary villas minutes from the beaches of North Goa. Each villa opens onto a private courtyard and plunge pool, framed by laterite stone walls and frangipani trees.',
        'Interiors celebrate Goan craft — handmade tiles, teak joinery and lime-plastered walls — with the convenience of a managed rental programme for owners who split their time.'
      ],
      amenities: ['Private plunge pool', 'Landscaped courtyard', 'Handmade Goan tiles', 'Teak joinery', 'Optional rental management', 'Outdoor shower', 'Caretaker room', 'Minutes from the beach'],
      images: ['photo-1512917774080-9991f1c4c750', 'photo-1564013799919-ab600027ffc6', 'photo-1600210492486-724fe5c67fb0', 'photo-1505691938895-1758d7feb511'],
      agent: 'nikhil'
    },
    {
      id: 'the-grand-atrium',
      title: 'The Grand Atrium',
      type: 'villa',
      status: 'sale',
      price: 76000000,
      locality: 'Jubilee Hills',
      city: 'Hyderabad',
      address: 'Road No. 45, Jubilee Hills, Hyderabad 500033',
      beds: 5, baths: 6, area: 6000,
      yearBuilt: 2021, parking: 4, furnishing: 'Semi-furnished',
      badges: ['featured'],
      listedOn: '2026-09-05',
      summary: 'Statement villa with double-height living room and home theatre.',
      description: [
        'The Grand Atrium is defined by its soaring, sky-lit central atrium around which every room is arranged. The double-height living room opens to a terrace garden, while a twelve-seat home theatre and a cigar lounge occupy the lower level.',
        'Five suites, including a primary wing with its own private terrace, are finished in walnut and travertine. The villa sits on one of Jubilee Hills’ most sought-after roads, close to the city’s finest clubs and schools.'
      ],
      amenities: ['Sky-lit central atrium', 'Double-height living room', '12-seat home theatre', 'Cigar lounge', 'Terrace garden', 'Elevator', 'Staff quarters', 'Four-car garage'],
      images: ['photo-1600596542815-ffad4c1539a9', 'photo-1600607687939-ce8a6c25118c', 'photo-1600573472550-8090b5e0745e', 'photo-1616594039964-ae9021a400a0'],
      agent: 'sanya'
    },
    {
      id: 'palm-crest-residences',
      title: 'Palm Crest Residences',
      type: 'apartment',
      status: 'rent',
      price: 450000,
      locality: 'Worli',
      city: 'Mumbai',
      address: 'Dr. Annie Besant Road, Worli, Mumbai 400018',
      beds: 3, baths: 4, area: 2800,
      yearBuilt: 2020, parking: 2, furnishing: 'Fully furnished',
      badges: ['featured'],
      listedOn: '2026-10-02',
      summary: 'Fully furnished sea-view residence for executive leasing.',
      description: [
        'Palm Crest offers a turnkey, fully furnished three-bedroom residence with views of the Bandra–Worli Sea Link. Ideal for senior executives and relocating families, the home is styled with a restrained palette of oak, linen and brass.',
        'Residents enjoy a full-service clubhouse, a 25-metre pool and a business centre, with Lower Parel and BKC both within a short drive.'
      ],
      amenities: ['Fully furnished', 'Sea Link views', 'Clubhouse & 25 m pool', 'Business centre', 'Housekeeping available', 'Concierge', 'Two parking bays', 'Pet friendly'],
      images: ['photo-1522708323590-d24dbb6b0267', 'photo-1600210492486-724fe5c67fb0', 'photo-1505691938895-1758d7feb511', 'photo-1556909114-f6e7ad7d3136'],
      agent: 'meera'
    },
    {
      id: 'lumiere-sky-suites',
      title: 'Lumière Sky Suites',
      type: 'apartment',
      status: 'rent',
      price: 275000,
      locality: 'Indiranagar',
      city: 'Bengaluru',
      address: '100 Feet Road, Indiranagar, Bengaluru 560038',
      beds: 3, baths: 3, area: 2400,
      yearBuilt: 2023, parking: 2, furnishing: 'Semi-furnished',
      badges: ['new'],
      listedOn: '2026-10-14',
      summary: 'Light-filled sky suite in the heart of Indiranagar.',
      description: [
        'Lumière Sky Suites sits above the tree line of Indiranagar, offering wide city views and abundant natural light. The open-plan living and dining area flows onto a deep balcony that is perfect for Bengaluru’s mild evenings.',
        'Semi-furnished with wardrobes, lighting and a fully fitted kitchen, the suite is a short walk from the neighbourhood’s best restaurants and a quick drive to the CBD.'
      ],
      amenities: ['Deep entertaining balcony', 'Fitted kitchen', 'Built-in wardrobes', 'Rooftop pool', 'Gym & yoga deck', 'Co-working lounge', 'Two parking bays'],
      images: ['photo-1493809842364-78817add7ffb', 'photo-1502672260266-1c1ef2d93688', 'photo-1616594039964-ae9021a400a0', 'photo-1584622650111-993a426fbf0a'],
      agent: 'sanya'
    },
    {
      id: 'aravalli-ridge-estate',
      title: 'Aravalli Ridge Estate Plot',
      type: 'plot',
      status: 'sale',
      price: 38500000,
      locality: 'Sohna Road',
      city: 'Gurugram',
      address: 'Aravalli Ridge Estate, Sohna Road, Gurugram 122018',
      beds: 0, baths: 0, area: 10890,
      yearBuilt: null, parking: null, furnishing: 'Not applicable',
      badges: [],
      listedOn: '2026-07-22',
      summary: 'Quarter-acre residential plot with Aravalli views in a gated estate.',
      description: [
        'A rare quarter-acre residential plot within a low-density gated estate at the foothills of the Aravallis. The east-facing plot has clear title, approved building plans for a G+2 residence and all utilities at the boundary.',
        'With the Dwarka Expressway and Southern Peripheral Road nearby, the corridor has seen strong appreciation — an excellent opportunity to build a bespoke residence or hold as a long-term investment.'
      ],
      amenities: ['Clear, verified title', 'Approved G+2 plans', 'East facing', 'Utilities at boundary', 'Gated estate with security', 'Internal roads & street lighting', 'Clubhouse access'],
      images: ['photo-1500382017468-9049fed747ef', 'photo-1501785888041-af3ef285b470', 'photo-1441974231531-c6227db76b6e'],
      agent: 'arjun'
    },
    {
      id: 'bkc-signature-offices',
      title: 'BKC Signature Offices',
      type: 'commercial',
      status: 'sale',
      price: 145000000,
      locality: 'Bandra Kurla Complex',
      city: 'Mumbai',
      address: 'G Block, Bandra Kurla Complex, Mumbai 400051',
      beds: 0, baths: 4, area: 8200,
      yearBuilt: 2019, parking: 8, furnishing: 'Fully furnished',
      badges: ['featured'],
      listedOn: '2026-09-20',
      summary: 'Grade-A, fully fitted office floor in Mumbai’s premier business district.',
      description: [
        'An 8,200 sq.ft Grade-A office floor in a LEED Platinum tower in G Block, BKC. The space is fully fitted with 72 workstations, eight cabins, two boardrooms and a pantry, and is ready for immediate occupation.',
        'Offered with a quality tenant option for investors seeking stable rental yield in the city’s most resilient commercial micro-market.'
      ],
      amenities: ['LEED Platinum building', 'Fully fitted workspace', '72 workstations', 'Two boardrooms', 'Eight reserved parking bays', 'High-speed elevators', '100% power backup', 'Tenant option available'],
      images: ['photo-1486406146926-c627a92ad1ab', 'photo-1497366216548-37526070297c', 'photo-1497366811353-6870744d04b2'],
      agent: 'meera'
    },
    {
      id: 'casa-siolim',
      title: 'Casa Siolim',
      type: 'villa',
      status: 'rent',
      price: 380000,
      locality: 'Siolim',
      city: 'Goa',
      address: 'Siolim, Bardez, North Goa 403517',
      beds: 4, baths: 5, area: 3900,
      yearBuilt: 2018, parking: 3, furnishing: 'Fully furnished',
      badges: ['new'],
      listedOn: '2026-10-10',
      summary: 'Restored Portuguese villa on the Chapora river for long lets.',
      description: [
        'Casa Siolim is a lovingly restored Indo-Portuguese villa on the banks of the Chapora river. High ceilings, oyster-shell windows and a wraparound verandah are paired with a modern kitchen and air-conditioned suites.',
        'Available for long-term lease, fully furnished with a resident caretaker and cook on request.'
      ],
      amenities: ['River frontage', 'Restored heritage villa', 'Private pool', 'Wraparound verandah', 'Resident caretaker', 'Cook on request', 'Fully air-conditioned', 'Three parking spaces'],
      images: ['photo-1564013799919-ab600027ffc6', 'photo-1600573472550-8090b5e0745e', 'photo-1505691938895-1758d7feb511', 'photo-1556909114-f6e7ad7d3136'],
      agent: 'nikhil'
    },
    {
      id: 'cyber-city-corporate-suites',
      title: 'Cyber City Corporate Suites',
      type: 'commercial',
      status: 'rent',
      price: 1250000,
      locality: 'DLF Cyber City',
      city: 'Gurugram',
      address: 'DLF Cyber City, Phase 2, Gurugram 122002',
      beds: 0, baths: 6, area: 12500,
      yearBuilt: 2017, parking: 12, furnishing: 'Warm shell',
      badges: [],
      listedOn: '2026-08-12',
      summary: 'Warm-shell corporate floor with metro connectivity, ready for fit-out.',
      description: [
        'A 12,500 sq.ft warm-shell office floor in one of DLF Cyber City’s landmark towers, steps from the Rapid Metro. Efficient floor plates and a 9-metre column grid allow flexible layouts.',
        'Rent-free fit-out period negotiable for the right corporate occupier.'
      ],
      amenities: ['Warm shell, ready for fit-out', 'Rapid Metro access', 'Efficient floor plate', '12 reserved parking bays', 'Food court & retail', 'IGBC Gold certified', '24/7 security'],
      images: ['photo-1497366811353-6870744d04b2', 'photo-1486406146926-c627a92ad1ab', 'photo-1497366216548-37526070297c'],
      agent: 'arjun'
    },
    {
      id: 'nandi-foothills-plot',
      title: 'Nandi Foothills Plot',
      type: 'plot',
      status: 'sale',
      price: 18500000,
      locality: 'Devanahalli',
      city: 'Bengaluru',
      address: 'Nandi Foothills Road, Devanahalli, Bengaluru 562110',
      beds: 0, baths: 0, area: 21780,
      yearBuilt: null, parking: null, furnishing: 'Not applicable',
      badges: ['new'],
      listedOn: '2026-10-05',
      summary: 'Half-acre plot near the airport corridor with views of Nandi Hills.',
      description: [
        'A half-acre, BIAAPA-approved plot in a managed farmland community near Devanahalli, with views towards Nandi Hills. Ideal for a weekend home or a long-term land holding along Bengaluru’s fastest-growing airport corridor.',
        'The community offers a clubhouse, managed plantations and round-the-clock security.'
      ],
      amenities: ['BIAAPA approved', 'Half-acre plot', 'Nandi Hills views', 'Managed plantation', 'Clubhouse', '20 minutes to the airport', 'Gated & secured'],
      images: ['photo-1501785888041-af3ef285b470', 'photo-1500382017468-9049fed747ef', 'photo-1441974231531-c6227db76b6e'],
      agent: 'sanya'
    }
  ];

  window.AURELIA_DATA = { properties: properties, agents: agents, img: img };
})();
