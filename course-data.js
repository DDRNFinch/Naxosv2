const parseKSB=(text)=>Object.fromEntries(text.trim().split('\n').filter(Boolean).map(line=>{const i=line.indexOf('|');return [line.slice(0,i),line.slice(i+1)];}));
const L=(k,s,label)=>({k:Array.isArray(k)?k:[k],s:Array.isArray(s)?s:[s],label});
const P=(area,title,intro,links,behaviours=[],photo=[])=>({area,title,intro,links,behaviours,photo});

const carpentryCoreK=parseKSB(`
K1|Awareness of health and safety regulations, standards, and guidance and impact on role. Control of Substances Hazardous to Health (CoSHH). Fire safety. Health and Safety at Work Act. Asbestos awareness. Manual handling. signage, fire extinguishers. Safety signage. Situational awareness. Slips, trips, and falls. Working in confined spaces. Working at height. Provision and use of work equipment regulations (PUWER) and Electrical safety.
K2|Safety control equipment and how to use personal protective equipment (PPE) respiratory protective equipment (RPE) and local exhaust ventilation (LEV).
K3|Safe systems of work: Site inductions, tool box talks, risk assessments, method statements and hazard identification in the work area.
K4|Impact of the sector on the environment: Efficient use of resources. Recycling, reuse, safe disposal of waste and sustainable forestry.
K5|Principles of building and modern methods of construction: Foundations, roofs, walls, damp proof courses, floors, timber frame, structurally insulated panels (SIPS) utilities and services, internal plaster finishes, insulation, fire protection, moisture and air protection and quality of materials.
K6|Basic principles of digital design and modelling systems.
K7|Standards and regulations associated with carpentry activities: British standards, building regulations and warranty provider standards.
K8|Methods of interpreting and extracting relevant information from drawings and specifications.
K9|Materials and their characteristics of home grown and imported timber and timber-based products. Natural timber products: Hardwood and softwood. Manufactured timber products: Board, laminated timber and carcassing.
K10|Timber decay and repair methods: Timber moisture content parameters for a range of timber and timber-based materials, wet rot and dry rot, and insect attack.
K11|Carpentry and joinery products and purpose: Mastics, preservatives, wood fillers, plastics and ironmongery.
K12|Basic material estimation techniques, calculating lengths of timber, fixing requirements and a cutting list production methods.
K13|Verbal communication techniques and construction terminology.
K14|Hand tool use and storage methods and techniques: Chisels, planes, hand saws, hammers, squares, tri-square, bevels, marking and mortise gauges, spirit levels.
K15|Hand tool maintenance and sharpening techniques.
K16|Jig production techniques.
K17|Power tools use and storage methods and techniques: Portable circular saws, drills, saws, planers, routers, sanders, multi-functional tools and nail guns.
K18|Principles of good team working.
K19|Inclusion, equity and diversity in the workplace.
K20|Well-being: Mental and physical health considerations in self and others and how to access support.
K40|Employment types (self employed and employed), small business start up principles and tax.`);
const carpentryCoreS=parseKSB(`
S1|Comply with health and safety regulations, standards, and guidance.
S2|Identify and use safety control equipment, for example, RPE, dust suppression, PPE and LEV.
S3|Comply with environmental and sustainability regulations, standards, and guidance. Segregate resources for reuse, recycling and disposal.
S4|Comply with industry regulations, standards, and guidance.
S5|Prepare and maintain a safe working area.
S6|Interpret and use information from drawings and specifications.
S7|Estimate required materials and produce a cutting list.
S8|Verbally communicate with others, applying construction terminology.
S9|Select, use and store hand tools.
S10|Select, use and store power tools.
S11|Maintain and sharpen hand tools.
S12|Produce jigs.
S13|Identifies well-being support available to self and others.`);
const carpentryB=parseKSB(`
B1|Put health, safety and wellbeing first.
B2|Consider the environment when using resources and carrying out processes.
B3|Contribute to an inclusive and diverse culture.
B4|Seek learning and development opportunities.
B5|Team-focus to meet team goals including, considering the wider build team.`);

const siteK={...carpentryCoreK,...parseKSB(`
K21|Site carpentry techniques: Measuring, marking out, fitting, cutting (straight and angled) and mitring.
K22|Site carpentry: Structural fixtures and timber sizing in site carpentry, how to use sizing tables.
K23|Site Carpenter: Timber sizing tables purpose and use.
K24|Site carpentry: Timber splicing and scribing techniques.
K25|Site carpentry: Straight roof installation techniques: Basic rafter trussed (prefabricated) and traditional cut roof (built on site).
K26|Site carpentry: Flat roofs: Warm and cold flat roofs including firings and coverings.
K27|Site carpentry: First fixing installation techniques: Structural carcassing (load bearing studwork), floor joists and coverings, straight flights of stairs, metal and timber stud partitions.
K28|Site carpentry: Second fix installation techniques: Service encasement, cladding, wall and floor units and fitments, window boards, handrails and spindles to straight flights of stairs, doors and mouldings (architrave and skirting board).
K29|Site carpentry: Types, use, calibration and storage of laser levels.`)};
const siteS={...carpentryCoreS,...parseKSB(`
S14|Site carpenter: Apply first fix techniques and practices for: 1. structural carcassing (load bearing studwork), 2. straight timber or metal partition walls, 3. floor joists 4. floor joist coverings and 5. straight flights of stairs.
S15|Site carpenter: Install structural fixings.
S16|Site carpenter: Size timber from sizing tables.
S17|Site carpenter: Apply site second fix techniques and practices for: 1. service encasement, 2. cladding 3. wall and floor units and fitments, 4. handrails and spindles to straight flights of stairs, 5. internal and external doors, 6. skirting boards and architrave, 7. window boards.
S18|Site carpenter: Apply site carpenter techniques and practices to construction of rafter roofs, including trussed (prefabricated) and traditional (built on site) including the construction of verge, eaves and fitting loft access.
S19|Site carpenter: Use and store laser levels for example cross line laser.
S20|Site carpenter: Form connections, for example, using joints, nails, screws, bolts and adhesive.
S21|Site carpenter: Apply measuring, marking out, cutting (square and angled), mitring, hinging and recessing techniques.
S22|Site carpenter: Carrying out splicing and scribing techniques.`)};

const joinK={...carpentryCoreK,...parseKSB(`
K30|Architectural joiner: Requirements of fire door assemblies.
K31|Architectural joiner: Safe use of fixed machinery, inspection, preparation and operation techniques: Crosscut saw, band saw, planer and thicknesser and mortiser.
K32|Architectural joiner: Setting out and marking out techniques for joinery product manufacture and potential effects of marking out errors.
K33|Architectural joiner: Timber joints, types and production techniques: Dovetails, mortise and tenon, bridals and halvings.
K34|Architectural joiner: Manufacture and assembly techniques for standard right angled timber windows.
K35|Architectural joiner: Connection methods in joinery: Dowels, biscuit, staples and adhesives.
K36|Architectural joiner: Manufacture and assembly techniques for timber first fix products: 1. straight staircases 2. door frames and linings.
K37|Architectural joiner: Manufacture and assembly techniques for second fix timber products: 1. timber wall and floor units 2. timber doors 3. timber mouldings.
K38|Architectural joiner: Finishing techniques for manufactured timber products: Sanding, painting, waxing, polishing, oiling and applying preservative.
K39|Architectural joiner: Ironmongery installation techniques.`)};
const joinS={...carpentryCoreS,...parseKSB(`
S23|Architectural joiner: Produce setting out details, including setting rods, and mark out for timber products.
S24|Architectural joiner: Produce basic woodworking joints including dovetail, bridal, mortise and tenon and halving.
S25|Architectural joiner: Form connections using dowels, biscuit, staples and adhesives.
S26|Architectural joiner: Apply techniques and practices to the manufacture and assembly of a timber window with casement including glazing rebates and associated ironmongery.
S27|Architectural joiner: Apply manufacture and assembly techniques for first fix products: 1. straight staircases, 2. door frames and linings.
S28|Architectural joiner: Apply manufacture and assembly techniques for second fix products: 1. timber doors, 2. wall and floor units, 3. timber mouldings, 4. staircase spindles and balustrades.
S29|Architectural joiner: Fit ironmongery including door locks, door handles, door hinges, latches and draw runners.
S30|Architectural joiner: Inspect, prepare and operate fixed machinery.`)};

const brickK=parseKSB(`
K1|Awareness of health and safety regulations, standards, and guidance and impact on role. Control of Substances Hazardous to Health (CoSHH). Fire safety. Health and Safety at Work Act. Asbestos awareness. Manual handling. signage, fire extinguishers. Safety signage. Situational awareness. Slips, trips, and falls. Working in confined spaces. Working at height. Electrical safety respiratory protective equipment (RPE), dust suppression.
K2|Safety control equipment and how to use personal protective equipment (PPE).
K3|Safe systems of work: Site inductions, toolbox talks, risk assessments, method statements and hazard identification in the work area.
K4|Impact of the sector on the environment: Efficient use of resources. Recycling, reuse, surface water contamination and safe disposal of waste.
K5|The importance and considerations of the environment and sustainability: Thermal qualities, airtightness and ventilation in buildings.
K6|Principles of building: Foundations, roofs, walls, cavity step trays, floors, utilities and services, insulation, fire, moisture and air protection, damp proof courses, the use of brick ties and quality of materials.
K7|Standards and regulations associated with bricklaying activities: British standards, building regulations and warranty provider standards.
K8|Materials and their characteristics: Bricks and blocks, efflorescence, mortar, damp proof courses (DPC), wall ties, plasticisers, concrete and steel lintels, Rolled Steel Joist (RSJ), fire stopping, insulation, cement and building sand.
K9|Modern methods of construction: Rapid build technology, precast components, corner profiles, alternative frame and cladding systems, masonry support systems.
K10|Methods of interpreting and extracting relevant information from drawings and specifications.
K11|Basic principles of digital design and modelling systems.
K12|Simple resource estimation techniques: Quantity of bricks and blocks, amount of mortar, quantity of wall ties, DPCs, cavity trays and lintels.
K13|Hand tool use, maintenance and storage: Levels, measures, hammers, bolsters, brick hammers, trowels, brick jointer, line blocks and pins, scutch, chariot and brick clamps.
K14|Power tool use and limitations: Disc cutters, mixers and drills.
K15|Bond types: English bond, flemish bond, garden wall bonds and broken bond.
K16|Brick solid wall setting out, construction and capping methods.
K17|Joint finishes: Half round, flush, weather struck and recessed.
K18|Principles of basic decorative walling and piers: projecting and contrasting brick, isolated and attached pier, banding.
K19|Principles of the use of expansion joints.
K20|Mixing Mortar: Ratios, silos, pre-mixed, gauging, hand mixing and mechanical mixing.
K21|Cavity wall setting out techniques: Bricks and blocks, openings and levels, use of profiles, gauge rods and squares.
K22|Cavity wall construction using stretcher bond brick and block walling, forming openings, closing cavities. selection and placement of wall ties, insulation, damp proof courses (DPCs), cavity trays, weep holes, lintels and fire stopping.
K23|Brick on edge and soldier courses: setting out and construction techniques.
K24|Defects and repair: Construction defects and repair methods.
K25|Methods of protecting materials and work: Frost, water and construction damage.
K26|Verbal communication techniques and construction terminology.
K27|Principles of good team working.
K28|Inclusion, equity and diversity in the workplace.
K29|Methods of cutting bricks and blocks using hand tools.
K30|Brick walls with raking cut: Setting out and construction techniques.
K31|Well-being: Mental and physical health considerations in self and others and how to access support.`);
const brickS=parseKSB(`
S1|Comply with health and safety regulations, standards, and guidance.
S2|Identify and use personal protective equipment (PPE).
S3|Comply with environmental and sustainability regulations, standards, and guidance. Segregate resources for reuse, recycling and disposal.
S4|Comply with industry regulations, standards, and guidance.
S5|Read and interpret information from drawings and specifications.
S6|Estimate and select required resources: For example, the quantity of bricks and blocks, mortar, wall ties and insulation.
S7|Prepare and maintain a safe working area.
S8|Select and use hand tools.
S9|Maintain and store hand tools.
S10|Set out brick and block cavity wall to given tolerances, including an opening.
S11|Construct a stretcher bond brick and block cavity wall with return and opening to given tolerances, including installing a lintel with soldiers, brick and edge sill, closure around opening, insulation, fire stopping, cavity tray, damp proof course (DPC) and weep holes.
S12|Apply joint finishes: For example, half round, flush, weather struck and recessed.
S13|Set out and construct a simple brick solid wall with capping.
S14|Gauge and hand mix mortar to ratio.
S15|Measure and cut bricks and blocks using hand tools, to given tolerances.
S16|Carry out a simple repair: For example, replacing damaged bricks.
S17|Protect materials and finished work.
S18|Verbally communicate with others, applying construction terminology.
S19|Follow equity, diversity and inclusion guidance.
S20|Applies team working principles to their own and the wider build team.
S21|Identifies well-being support available to self and others.
S22|Construct a brick wall with raking cut. For example, gable end wall or garden wall with raking cut.`);
const brickB=parseKSB(`
B1|Put health, safety and wellbeing first.
B2|Consider the environment when using resources and carrying out processes.
B3|Take ownership of given work.
B4|Contribute to an inclusive and diverse culture.
B5|Seek learning and development opportunities.
B6|Team-focus to meet team goals including, considering the wider build team.`);

const sitePacks=[
P('First Fix','Structural carcassing','Load-bearing studwork and structural carcassing.',[L('K27','S14','First-fix carcassing'),L('K21','S21','Measure, mark, cut and fit'),L(['K22','K23'],['S15','S16'],'Structural fixings and timber sizing'),L('K8','S6','Drawings and specifications'),L('K12','S7','Materials and cutting list'),L('K14','S9','Hand tools'),L('K17','S10','Power tools'),L('K13','S8','Site communication')],['B1','B2','B5']),
P('First Fix','Timber partition walls','Straight timber partition wall construction.',[L('K27','S14','Timber partitions'),L('K21','S21','Measure, mark, cut and fit'),L('K22','S15','Structural fixings'),L('K29','S19','Laser level'),L('K2','S2','PPE, RPE and dust control'),L('K3','S5','Safe work area'),L('K14','S9','Hand tools'),L('K17','S10','Power tools')],['B1','B2','B5']),
P('First Fix','Metal partition walls','Straight metal partition wall construction.',[L('K27','S14','Metal partitions'),L('K21','S21','Measure, mark and cut'),L('K22','S15','Structural fixings'),L('K29','S19','Laser level'),L('K2','S2','PPE and safety controls'),L('K17','S10','Power tools')],['B1','B2','B5']),
P('First Fix','Floor joists','Setting out, sizing and installing floor joists.',[L('K27','S14','Floor joists'),L(['K22','K23'],['S15','S16'],'Fixings and timber sizing'),L('K21','S21','Measure, mark and cut'),L('K8','S6','Drawings and specifications'),L('K12','S7','Materials and cutting list'),L('K14','S9','Hand tools')],['B1','B2','B5']),
P('First Fix','Floor joist coverings / flooring','Installing floor joist coverings and floor sheets/boards.',[L('K27','S14','Floor coverings'),L('K21','S21','Measure, mark and cut'),L('K24','S22','Scribing'),L('K17','S10','Power tools'),L('K4','S3','Waste and sustainability'),L('K11','S20','Fixings and adhesives')],['B1','B2']),
P('First Fix','Straight staircases – first fix','Installing straight flights of stairs.',[L('K27','S14','Straight stair installation'),L('K21','S21','Measure, mark and cut'),L('K22','S15','Structural fixings'),L('K24','S22','Scribing'),L('K8','S6','Drawings and specifications')],['B1','B5']),
P('Second Fix','Service encasements','Second-fix service boxing and encasements.',[L('K28','S17','Service encasement'),L('K21','S21','Measure, mark, cut and mitre'),L('K24','S22','Scribing'),L('K29','S19','Laser level'),L('K11','S20','Connections and adhesives')],['B1','B2']),
P('Second Fix','Cladding','Installing internal or external cladding systems within the site carpenter scope.',[L('K28','S17','Cladding'),L('K21','S21','Measure, mark, cut and mitre'),L('K24','S22','Scribing'),L('K2','S2','RPE and dust control'),L('K4','S3','Waste and sustainability'),L('K11','S20','Connections and fixings')],['B1','B2']),
P('Second Fix','Wall and floor units / fitments','Installing wall units, floor units and associated fitments.',[L('K28','S17','Units and fitments'),L('K21','S21','Measure, mark, cut and fit'),L('K24','S22','Scribing'),L('K29','S19','Laser level'),L('K11','S20','Connections and ironmongery')],['B1','B5']),
P('Second Fix','Handrails and spindles','Second-fix handrails and spindles to straight flights.',[L('K28','S17','Handrails and spindles'),L('K21','S21','Measure, mark, angle cut and fit'),L('K22','S15','Structural fixings'),L('K24','S22','Scribing')],['B1','B5']),
P('Second Fix','Internal doors','Hanging, fitting and adjusting internal doors.',[L('K28','S17','Internal doors'),L('K21','S21','Measuring, hinging and recessing'),L('K24','S22','Scribing'),L('K11','S20','Ironmongery and connections'),L('K16','S12','Jig production where used'),L('K2','S2','RPE and dust control when trimming')],['B1','B5']),
P('Second Fix','External doors','Hanging, fitting and adjusting external doors.',[L('K28','S17','External doors'),L('K21','S21','Measuring, hinging and recessing'),L('K24','S22','Scribing'),L('K11','S20','Ironmongery, mastics and connections'),L('K10','S17','Timber moisture, decay and protection')],['B1','B2','B5']),
P('Second Fix','Skirting and architrave','Fitting skirting boards and architraves.',[L('K28','S17','Mouldings'),L('K21','S21','Measuring, mitring and cutting'),L('K24','S22','Scribing'),L('K2','S2','RPE and dust control'),L('K11','S20','Adhesives and fixings')],['B1','B2']),
P('Second Fix','Window boards','Fitting and finishing window boards.',[L('K28','S17','Window boards'),L('K21','S21','Measure, mark and cut'),L('K24','S22','Scribing'),L('K11','S20','Fixings and adhesives')],['B1','B2']),
P('Roofing','Trussed / prefabricated roofs','Installing prefabricated trussed rafter roofs.',[L('K25','S18','Trussed roof installation'),L('K21','S21','Measure, mark and cut'),L('K22','S15','Structural fixings'),L('K8','S6','Roof drawings and specifications'),L('K14','S9','Hand tools'),L('K1','S1','Working at height and safety')],['B1','B5']),
P('Roofing','Traditional cut roofs','Constructing traditional built-on-site rafter roofs.',[L('K25','S18','Traditional roof installation'),L('K21','S21','Measure, mark and angled cut'),L(['K22','K23'],['S15','S16'],'Structural fixings and timber sizing'),L('K24','S22','Splicing'),L('K8','S6','Roof drawings and specifications'),L('K12','S7','Materials and cutting list'),L('K14','S9','Hand tools'),L('K1','S1','Working at height and safety')],['B1','B2','B5']),
P('Roofing','Roof finishing / details','Verge, eaves and loft access work.',[L('K25','S18','Verge, eaves and loft access'),L('K21','S21','Measure, mark, cut and fit'),L('K24','S22','Scribing / splicing'),L('K11','S20','Fixings and connections'),L('K17','S10','Power tools')],['B1','B2']),
P('Additional','Additional / gap evidence','Use this pack for any remaining KSB or unusual evidence that does not naturally sit in another task pack.',[],['B1','B2','B3','B4','B5'])
];

const joinPacks=[
P('Setting Out & Joints','Setting out details and rods','Produce setting-out details and setting rods for joinery manufacture.',[L('K32','S23','Setting out and marking out'),L('K8','S6','Drawings and specifications'),L('K12','S7','Cutting lists and material estimation'),L('K14','S9','Hand tools')],['B1','B5']),
P('Setting Out & Joints','Marking out timber products','Transfer setting-out information accurately onto timber products.',[L('K32','S23','Marking out'),L('K9','S23','Timber characteristics'),L('K14','S9','Marking and measuring tools')],['B1','B5']),
P('Setting Out & Joints','Mortise and tenon joints','Produce mortise and tenon joints.',[L('K33','S24','Mortise and tenon'),L('K14','S9','Hand tools'),L('K17','S10','Power tools'),L('K15','S11','Tool maintenance')],['B1']),
P('Setting Out & Joints','Dovetail, bridle and halving joints','Produce dovetail, bridle and halving joints.',[L('K33','S24','Woodworking joints'),L('K14','S9','Hand tools'),L('K17','S10','Power tools'),L('K15','S11','Tool maintenance')],['B1']),
P('Setting Out & Joints','Dowel, biscuit, staple and adhesive connections','Form manufactured joinery connections.',[L('K35','S25','Connection methods'),L('K11','S25','Joinery products and adhesives'),L('K17','S10','Power tools')],['B1','B2']),
P('Windows & First Fix','Timber windows and casements','Manufacture and assemble a timber window with casement.',[L('K34','S26','Window manufacture and assembly'),L('K32','S23','Setting out'),L('K35','S25','Connections'),L('K39','S29','Associated ironmongery'),L('K38','S26','Finishing techniques')],['B1','B5']),
P('Windows & First Fix','Glazing rebates and window ironmongery','Form glazing rebates and fit associated window ironmongery.',[L('K34','S26','Glazing rebates'),L('K39','S29','Ironmongery'),L('K21','S10','')].filter(x=>joinK[x.k?.[0]]||x.k?.[0]!=='K21'),['B1']),
P('Windows & First Fix','Straight staircases','Manufacture and assemble straight staircase first-fix products.',[L('K36','S27','Straight staircase manufacture'),L('K32','S23','Setting out'),L('K33','S24','Jointing'),L('K35','S25','Connections')],['B1','B5']),
P('Windows & First Fix','Door frames','Manufacture and assemble timber door frames.',[L('K36','S27','Door frame manufacture'),L('K32','S23','Setting out'),L('K33','S24','Jointing'),L('K35','S25','Connections')],['B1','B5']),
P('Windows & First Fix','Door linings','Manufacture and assemble timber door linings.',[L('K36','S27','Door lining manufacture'),L('K32','S23','Setting out'),L('K35','S25','Connections')],['B1','B5']),
P('Second Fix Products','Timber doors','Manufacture and assemble timber doors.',[L('K37','S28','Timber doors'),L('K30','S28','Fire door requirements where applicable'),L('K39','S29','Door ironmongery'),L('K38','S28','Finishing')],['B1','B5']),
P('Second Fix Products','Wall and floor units','Manufacture and assemble timber wall and floor units.',[L('K37','S28','Wall and floor units'),L('K35','S25','Connections'),L('K39','S29','Draw runners / ironmongery'),L('K38','S28','Finishing')],['B1','B2']),
P('Second Fix Products','Timber mouldings','Manufacture timber mouldings and finish them to specification.',[L('K37','S28','Timber mouldings'),L('K38','S28','Finishing techniques'),L('K31','S30','Fixed machinery where used')],['B1','B2']),
P('Second Fix Products','Spindles and balustrades','Manufacture and assemble staircase spindles and balustrades.',[L('K37','S28','Spindles and balustrades'),L('K32','S23','Setting out'),L('K35','S25','Connections'),L('K38','S28','Finishing')],['B1','B5']),
P('Second Fix Products','Ironmongery','Fit locks, handles, hinges, latches and drawer runners.',[L('K39','S29','Ironmongery installation'),L('K11','S29','Ironmongery products'),L('K30','S29','Fire door ironmongery where applicable'),L('K16','S12','Jigs where produced')],['B1']),
P('Workshop Practice','Fixed machinery','Inspect, prepare and operate fixed workshop machinery.',[L('K31','S30','Fixed machinery'),L('K1','S1','Machinery safety'),L('K2','S2','Safety controls'),L('K3','S5','Safe workshop area')],['B1']),
P('Workshop Practice','Additional / gap evidence','Capture any remaining core or route-specific KSBs.',[],['B1','B2','B3','B4','B5'])
];

const brickPacks=[
P('Cavity Walling','Cavity wall setting out','Set out brick and block cavity walling including openings and levels.',[L('K21','S10','Cavity setting out'),L('K10','S5','Drawings and specifications'),L('K12','S6','Resource estimation'),L('K13',['S8','S9'],'Hand tools'),L('K3','S7','Safe work area')],['B1','B3','B6']),
P('Cavity Walling','Brick and block cavity walling','Construct stretcher-bond brick and block cavity walling with returns and openings.',[L('K22','S11','Cavity construction'),L('K8','S11','Materials'),L('K15','S11','Bonding'),L('K20','S14','Mortar'),L('K26','S18','Communication')],['B1','B2','B3','B6']),
P('Cavity Walling','Openings and lintels','Form openings, install lintels and construct associated soldier / brick-on-edge work.',[L('K22','S11','Openings and lintels'),L('K23','S11','Soldier and brick-on-edge courses'),L('K8','S11','Lintels and materials'),L('K29','S15','Hand cutting')],['B1','B3']),
P('Cavity Walling','DPC, cavity trays and weep holes','Install damp-proof courses, cavity trays and weep holes.',[L('K22','S11','DPC, trays and weeps'),L('K6','S11','Moisture protection'),L('K8','S11','DPC and cavity materials'),L('K7','S4','Standards and regulations')],['B1','B2','B3']),
P('Cavity Walling','Ties, insulation and fire stopping','Install wall ties, insulation and fire stopping within cavity construction.',[L('K22','S11','Ties, insulation and fire stopping'),L(['K5','K6'],'S11','Thermal, fire and building principles'),L('K8','S11','Materials'),L('K12','S6','Resource estimation')],['B1','B2','B3']),
P('Solid & Feature Walling','Solid walling and capping','Set out and construct simple brick solid walls with capping.',[L('K16','S13','Solid walling and capping'),L('K15','S13','Bond types'),L('K10','S5','Drawings'),L('K12','S6','Resources')],['B1','B3']),
P('Solid & Feature Walling','Bonding','Construct and demonstrate appropriate brick bonds.',[L('K15','S13','Bond types'),L('K16','S13','Solid wall construction'),L('K13','S8','Hand tools')],['B1','B3']),
P('Solid & Feature Walling','Piers and decorative walling','Create basic decorative walling and piers.',[L('K18','S13','Decorative walling and piers'),L('K15','S13','Bonding'),L('K23','S13','Feature courses where used')],['B1','B3']),
P('Solid & Feature Walling','Brick-on-edge and soldier courses','Set out and construct brick-on-edge and soldier courses.',[L('K23','S11','Brick-on-edge / soldier work'),L('K29','S15','Cutting where required'),L('K17','S12','Joint finish')],['B1','B3']),
P('Solid & Feature Walling','Raking / gable walls','Construct brick walls with a raking cut such as gable ends.',[L('K30','S22','Raking-cut wall'),L('K29','S15','Hand cutting'),L('K10','S5','Drawings and setting out'),L('K13','S8','Hand tools')],['B1','B3']),
P('Mortar, Cutting & Finishing','Mixing mortar','Gauge and hand mix mortar to the required ratio.',[L('K20','S14','Mortar mixing'),L('K8','S14','Mortar materials'),L('K2','S2','PPE'),L('K4','S3','Environmental controls')],['B1','B2']),
P('Mortar, Cutting & Finishing','Cutting bricks and blocks','Measure and cut bricks and blocks by hand to tolerances.',[L('K29','S15','Hand cutting'),L('K13','S8','Hand tools'),L('K1','S1','Dust and safety'),L('K2','S2','PPE')],['B1']),
P('Mortar, Cutting & Finishing','Joint finishes','Apply half-round, flush, weather-struck and recessed joint finishes.',[L('K17','S12','Joint finishes'),L('K13','S8','Jointing tools'),L('K25','S17','Protecting finished work')],['B1','B3']),
P('Mortar, Cutting & Finishing','Repairs','Carry out simple masonry repairs such as replacing damaged bricks.',[L('K24','S16','Defects and repair'),L('K13','S8','Hand tools'),L('K25','S17','Protecting repaired work')],['B1','B3']),
P('Mortar, Cutting & Finishing','Protection and defects','Protect materials and finished work from frost, water and construction damage.',[L('K25','S17','Protection'),L('K24','S16','Defects and repair'),L('K4','S3','Environmental considerations')],['B1','B2','B3']),
P('Professional & Additional','Communication and teamwork','Capture naturally occurring communication and wider-build-team evidence.',[L('K26','S18','Communication'),L('K27','S20','Team working')],['B6']),
P('Professional & Additional','EDI and wellbeing','Capture inclusion, equity, diversity and wellbeing evidence.',[L('K28','S19','EDI'),L('K31','S21','Wellbeing')],['B1','B4','B5']),
P('Professional & Additional','Additional / gap evidence','Capture any remaining KSB that has not naturally appeared elsewhere.',[],['B1','B2','B3','B4','B5','B6'])
];

window.NAXOS_COURSES={
site:{id:'site',title:'Site Carpenter',standard:'ST0264',version:'1.4',level:2,option:'Site Carpenter',summary:'Site-based first fix, second fix and roofing work using timber and associated products.',knowledge:siteK,skills:siteS,behaviours:carpentryB,packs:sitePacks,meta:{duration:'24 months',minimumHours:'557',funding:'£13,000'}},
joiner:{id:'joiner',title:'Architectural Joiner',standard:'ST0264',version:'1.4',level:2,option:'Architectural Joiner',summary:'Workshop-based setting out, manufacture, assembly and fitting of architectural joinery products.',knowledge:joinK,skills:joinS,behaviours:carpentryB,packs:joinPacks,meta:{duration:'24 months',minimumHours:'557',funding:'£13,000'}},
brick:{id:'brick',title:'Bricklayer',standard:'ST0095',version:'1.2',level:2,option:'Bricklayer',summary:'Setting out, constructing and repairing brick and block walling using mortar and associated components.',knowledge:brickK,skills:brickS,behaviours:brickB,packs:brickPacks,meta:{duration:'24 months',minimumHours:'578',funding:'£13,000'}}
};