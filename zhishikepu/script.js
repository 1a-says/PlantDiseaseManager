// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 农作物分类切换功能
    const categoryItems = document.querySelectorAll('.category-item');
    // 标题元素已移除，不再使用

    // 农作物数据
    const cropData = {
        rice: {
            title: '水稻病虫害识别',
            diseases: [
                {
                    name: '稻瘟病',
                    description: '水稻最重要的病害之一,可引起大幅度减产',
                    category: '真菌性病害',
                    image: 'images/水稻/稻瘟病2.png',
                    details: {
                        basicInfo: {
                            diseaseType: '真菌性病害（非细菌/病毒）',
                            pathogen: '学名：Magnaporthe oryzae（稻瘟病菌），分类归属于子囊菌门',
                            aliases: '按危害部位分：苗瘟、叶瘟、穗颈瘟、谷粒瘟',
                            host: '水稻（籼稻、粳稻均易感，糯稻抗性较弱）'
                        },
                        occurrence: {
                            season: '南方：早稻4-6月、晚稻7-9月；北方：6-8月（雨季与高温叠加期）',
                            conditions: '温度20-30℃（最适24-28℃），相对湿度≥90%（连续阴雨易爆发）',
                            transmission: '1. 气流（主要）：病菌孢子随风吹到其他田块；2. 雨水：雨滴飞溅传播；3. 带病种子/稻草',
                            criticalPeriod: '苗期（苗瘟）、分蘖期（叶瘟）、抽穗期（穗颈瘟，危害最严重）'
                        },
                        symptoms: [
                            {
                                part: '幼苗（苗瘟）',
                                description: '苗基部变黑褐色，整株枯萎（像被开水烫过）',
                                severity: '轻度：单株发病；重度：连片死苗'
                            },
                            {
                                part: '叶片（叶瘟）',
                                description: '1. 慢性型：菱形病斑，中心灰白、边缘褐色，外有黄色晕圈；2. 急性型：暗绿色水渍状斑（暴雨后易出现）',
                                severity: '轻度：病叶率＜5%；中度：5%-20%；重度：＞20%'
                            },
                            {
                                part: '穗颈（穗颈瘟）',
                                description: '穗颈部位变褐坏死，穗子下垂（"吊颈穗"），籽粒空瘪',
                                severity: '轻度：瘪粒率10%-20%；重度：绝收'
                            },
                            {
                                part: '谷粒（谷粒瘟）',
                                description: '谷粒出现褐色斑点，严重时全粒变黑，失去商品价值',
                                severity: '轻度：病粒率＜5%；重度：＞15%'
                            }
                        ],
                        prevention: [
                            {
                                type: '农业防治（基础）',
                                methods: '1. 选抗病品种（如"湘早籼45号""龙粳31号"）；2. 与大豆/油菜轮作；3. 少施氮肥，增施磷钾肥',
                                window: '播种前（选种）、播种后（施肥）'
                            },
                            {
                                type: '物理防治（辅助）',
                                methods: '1. 种子消毒：用25%三环唑可湿性粉剂浸种；2. 清理田间病残体（病叶、病穗烧毁）',
                                window: '浸种时（播种前）、收获后'
                            },
                            {
                                type: '化学防治（应急）',
                                methods: '推荐药剂：1. 叶瘟：75%三环唑可湿性粉剂（每亩15-20g，兑水50kg喷雾）；2. 穗颈瘟：40%稻瘟灵乳油（每亩80-100ml）',
                                window: '叶瘟：发病初期；穗颈瘟：破口前3-5天（关键期）'
                            },
                            {
                                type: '生物防治（环保）',
                                methods: '1. 喷施春雷霉素（微生物制剂）；2. 释放天敌（如捕食性螨类）',
                                window: '发病初期，适合绿色种植区'
                            }
                        ],
                        economicImpact: {
                            yieldLoss: '轻度发病：损失5%-10%；重度发病：损失30%以上，甚至绝收（穗颈瘟危害最大）',
                            controlCost: '化学防治：每亩20-50元；生物防治：每亩30-60元（长期可减少农药残留问题）',
                            qualityImpact: '1. 病粒多导致大米商品等级下降（如从一级米降为三级米）；2. 过量施药易残留超标'
                        },
                        monitoring: {
                            methods: '1. 田间巡查：每周1-2次，重点看叶片、穗颈；2. 孢子捕捉仪：放置在田块中央，统计孢子数量',
                            confusion: '与稻曲病区分：稻曲病在穗部形成黄色"小疙瘩"（孢子团），稻瘟病是褐色病斑'
                        }
                    }
                },
                {
                    name: '稻曲病',
                    description: '真菌性病害,主要危害稻穗',
                    category: '真菌性病害',
                    image: 'images/水稻/稻曲病.jpeg',
                    details: {
                        basicInfo: {
                            diseaseType: '真菌性病害',
                            pathogen: '学名：Ustilaginoidea virens（稻曲病菌）',
                            aliases: '黑穗病、谷花病',
                            host: '水稻（主要危害稻穗）'
                        },
                        occurrence: {
                            season: '抽穗期至灌浆期（7-9月）',
                            conditions: '温度25-30℃，相对湿度80%以上，连续阴雨',
                            transmission: '1. 气流传播：孢子随风扩散；2. 种子带菌：病粒混入种子',
                            criticalPeriod: '抽穗期至灌浆期（关键防控期）'
                        },
                        symptoms: [
                            {
                                part: '稻穗',
                                description: '稻粒被黄色或黑色孢子团包裹，形成"小疙瘩"状病粒',
                                severity: '轻度：病粒率＜5%；重度：病粒率＞10%'
                            }
                        ],
                        prevention: [
                            {
                                type: '农业防治',
                                methods: '1. 选用抗病品种；2. 合理密植；3. 科学施肥',
                                window: '播种前、生长期'
                            },
                            {
                                type: '化学防治',
                                methods: '推荐药剂：25%丙环唑乳油（每亩20-30ml）',
                                window: '抽穗前5-7天'
                            }
                        ],
                        economicImpact: {
                            yieldLoss: '轻度：损失5%-10%；重度：损失20%以上',
                            controlCost: '每亩防治成本15-25元',
                            qualityImpact: '病粒影响稻米品质，降低商品价值'
                        },
                        monitoring: {
                            methods: '抽穗期田间巡查，观察稻穗病粒',
                            confusion: '与稻瘟病区分：稻曲病形成孢子团，稻瘟病是褐色病斑'
                        }
                    }
                },
                {
                    name: '水稻恶苗病',
                    description: '真菌性病害,导致植株徒长',
                    category: '真菌性病害',
                    image: 'images/水稻/水稻恶苗病.jpeg'
                },
                {
                    name: '水稻立枯病',
                    description: '真菌性病害,主要危害幼苗',
                    category: '真菌性病害',
                    image: 'images/水稻/水稻立枯病.png'
                },
                {
                    name: '水稻胡麻斑病',
                    description: '真菌性病害,叶片出现胡麻状斑点',
                    category: '真菌性病害',
                    image: 'images/水稻/水稻胡麻斑病.jpeg'
                },
                {
                    name: '水稻白叶枯病',
                    description: '细菌性病害,主要危害叶片',
                    category: '细菌性病害',
                    image: 'images/水稻/水稻白叶枯病.jpeg'
                },
                {
                    name: '水稻纹枯病',
                    description: '真菌性病害,危害叶鞘和茎秆',
                    category: '真菌性病害',
                    image: 'images/水稻/水稻纹枯病.jpeg'
                },
                {
                    name: '水稻细菌性条斑病',
                    description: '细菌性病害,叶片出现条斑症状',
                    category: '细菌性病害',
                    image: 'images/水稻/水稻细菌性条斑病.png'
                },
                {
                    name: '南方水稻黑条矮缩病',
                    description: '病毒性病害,植株矮化叶片变黄',
                    category: '病毒性病害',
                    image: 'images/水稻/南方水稻黑条矮缩病.png'
                },
                {
                    name: '水稻叶尖枯病',
                    description: '真菌性病害,叶尖出现枯死症状',
                    category: '真菌性病害',
                    image: 'images/水稻/水稻叶尖枯病.jpg'
                }
            ]
        },
        eggplant: {
            title: '茄子病虫害识别',
            diseases: [
                {
                    name: '茄子白粉病',
                    description: '真菌性病害,叶片出现白粉',
                    category: '真菌性病害',
                    image: 'images/茄子/茄子白粉病.png'
                },
                {
                    name: '茄子病毒病',
                    description: '病毒性病害,叶片出现花叶',
                    category: '病毒性病害',
                    image: 'images/茄子/茄子病毒病.png'
                },
                {
                    name: '茄子根腐病',
                    description: '真菌性病害,危害根部',
                    category: '真菌性病害',
                    image: 'images/茄子/茄子根腐病.png'
                },
                {
                    name: '茄子褐斑病',
                    description: '真菌性病害,叶片出现褐斑',
                    category: '真菌性病害',
                    image: 'images/茄子/茄子褐斑病.png'
                },
                {
                    name: '茄子褐纹病',
                    description: '真菌性病害,危害叶片和果实',
                    category: '真菌性病害',
                    image: 'images/茄子/茄子褐纹病.png'
                },
                {
                    name: '茄子黄萎病',
                    description: '真菌性病害,叶片变黄枯萎',
                    category: '真菌性病害',
                    image: 'images/茄子/茄子黄萎病.png'
                },
                {
                    name: '茄子灰霉病',
                    description: '真菌性病害,危害叶片和果实',
                    category: '真菌性病害',
                    image: 'images/茄子/茄子灰霉病.png'
                },
                {
                    name: '茄子茎基腐病',
                    description: '真菌性病害,危害茎基部',
                    category: '真菌性病害',
                    image: 'images/茄子/茄子茎基腐病.png'
                },
                {
                    name: '茄子绵疫病',
                    description: '真菌性病害,危害果实',
                    category: '真菌性病害',
                    image: 'images/茄子/茄子绵疫病.png'
                },
                {
                    name: '茄子青枯病',
                    description: '细菌性病害,导致植株枯萎',
                    category: '细菌性病害',
                    image: 'images/茄子/茄子青枯病.png'
                },
                {
                    name: '茄子细菌性叶斑病',
                    description: '细菌性病害,叶片出现叶斑',
                    category: '细菌性病害',
                    image: 'images/茄子/茄子细菌性叶斑病.png'
                },
                {
                    name: '茄子叶霉病',
                    description: '真菌性病害,危害叶片',
                    category: '真菌性病害',
                    image: 'images/茄子/茄子叶霉病.png'
                }
            ]
        },
        spinach: {
            title: '菠菜病虫害识别',
            diseases: [
                {
                    name: '菠菜叶斑病',
                    description: '真菌性病害,叶片出现斑点',
                    category: '真菌性病害',
                    image: 'images/菠菜/菠菜叶斑病.png',
                    details: {
                        basicInfo: {
                            diseaseType: '真菌性病害（叶部病害）',
                            pathogen: '学名：Cercospora beticola（尾孢霉属真菌）',
                            aliases: '又称菠菜尾孢叶斑病、褐斑病',
                            host: '菠菜、甜菜等藜科蔬菜，中晚熟品种更易感病'
                        },
                        occurrence: {
                            season: '冷凉湿润季节高发：设施栽培以早春、深秋最易流行，露地多在9-11月出现高峰',
                            conditions: '最适温度18-25℃，相对湿度≥85%，叶面结露持续6小时以上或连阴雨天气易暴发',
                            transmission: '病菌以病残体、病种子潜伏越冬，翌春借风雨、灌溉水和作业带菌传播，可在温室内循环侵染',
                            criticalPeriod: '菠菜4-8片真叶期至采收前是易感期，郁闭、通风差、偏施氮肥时尤需警惕'
                        },
                        symptoms: [
                            {
                                part: '叶片初期',
                                description: '叶面形成针尖大小水渍状点，随后扩展成圆形或近圆形褐斑，边缘紫褐色，背面略隆起',
                                severity: '轻度：下部老叶零星出现，斑点直径＜2mm'
                            },
                            {
                                part: '中后期叶片',
                                description: '病斑扩大并呈灰褐色同心轮纹，中央变灰白并出现黑色小点（分生孢子梗聚生），多斑融合成不规则大片',
                                severity: '中度：发病叶率10%-30%，叶片光合能力显著下降'
                            },
                            {
                                part: '严重发病',
                                description: '叶片大片坏死干枯，薄叶易破孔，叶柄基部也可出现褐斑并导致植株生长停滞甚至枯萎',
                                severity: '重度：发病叶率＞40%，商品叶丧失采收价值'
                            }
                        ],
                        prevention: [
                            {
                                type: '农业防治（基础）',
                                methods: '1. 选用抗病品种与健壮无病苗；2. 实行2年以上轮作（与葱蒜、瓜类等非寄主作物）; 3. 合理密植、及时清沟排涝、控制氮肥用量，增施磷钾肥提高抗性',
                                window: '播种前至整个营养生长期'
                            },
                            {
                                type: '物理防治（辅助）',
                                methods: '1. 设施内加强通风、降低夜间湿度；2. 清除病残体集中深埋或焚烧，减少菌源；3. 灌水后及时排湿、叶面保持干燥',
                                window: '日常管理及收获后'
                            },
                            {
                                type: '化学防治（应急）',
                                methods: '推荐药剂：1. 50%多菌灵可湿性粉剂80-100g/亩兑水喷雾；2. 25%苯醚甲环唑乳油15-20ml/亩；3. 30%苯醚甲环唑·丙环唑（2000-2500倍）交替使用，7-10天1次，连喷2-3次',
                                window: '发病初期至高发期，注意轮换药剂防止抗性'
                            },
                            {
                                type: '生物防治（绿色）',
                                methods: '1. 喷施枯草芽孢杆菌、哈茨木霉等生物制剂；2. 结合叶面喷施海藻肥、钙镁等，增强叶片抗逆力',
                                window: '发病初期或预防性使用'
                            }
                        ],
                        economicImpact: {
                            yieldLoss: '轻度发病产量损失5%-10%，中重度可达25%-40%，叶片坏死严重时批量报废',
                            controlCost: '常规化学防治成本约20-45元/亩/次，生物制剂配合营养调理约30-60元/亩',
                            qualityImpact: '病斑影响商品外观与可售等级，症状叶易腐烂、带菌贮运风险高'
                        },
                        monitoring: {
                            methods: '1. 棚室内安装温湿度记录仪，重点监测夜间相对湿度；2. 田间每周巡查2次，抽查叶片下层病斑；3. 结合孢子捕捉板掌握高危时段',
                            confusion: '易与菠菜炭疽病混淆：炭疽病斑中央呈黑色小点并伴凹陷且常沿叶脉，叶斑病斑较薄、边缘紫褐并具同心轮纹'
                        }
                    }
                },
                {
                    name: '菠菜心腐病',
                    description: '细菌性病害,危害心叶',
                    category: '细菌性病害',
                    image: 'images/菠菜/菠菜心腐病.png'
                },
                {
                    name: '菠菜枯萎病',
                    description: '真菌性病害,导致植株枯萎',
                    category: '真菌性病害',
                    image: 'images/菠菜/菠菜枯萎病.png'
                },
                {
                    name: '菠菜根结线虫病',
                    description: '线虫病害,危害根部',
                    category: '线虫病害',
                    image: 'images/菠菜/菠菜根结线虫病.png'
                },
                {
                    name: '菠菜炭疽病',
                    description: '真菌性病害,叶片出现炭疽斑',
                    category: '真菌性病害',
                    image: 'images/菠菜/菠菜炭疽病.png'
                },
                {
                    name: '菠菜猝倒病',
                    description: '真菌性病害,幼苗猝倒',
                    category: '真菌性病害',
                    image: 'images/菠菜/菠菜猝倒病.png'
                },
                {
                    name: '菠菜病毒病',
                    description: '病毒性病害,叶片出现花叶',
                    category: '病毒性病害',
                    image: 'images/菠菜/菠菜病毒病.png'
                },
                {
                    name: '菠菜茎枯病',
                    description: '真菌性病害,危害茎部',
                    category: '真菌性病害',
                    image: 'images/菠菜/菠菜茎枯病.png'
                },
                {
                    name: '菠菜霜霉病',
                    description: '真菌性病害,叶片出现霜霉',
                    category: '真菌性病害',
                    image: 'images/菠菜/菠菜霜霉病.png'
                },
                {
                    name: '菠菜黑斑病',
                    description: '真菌性病害,叶片出现黑斑',
                    category: '真菌性病害',
                    image: 'images/菠菜/菠菜黑斑病.png'
                }
            ]
        },
        wheat: {
            title: '小麦病虫害识别',
            diseases: [
                {
                    name: '小麦条锈病',
                    description: '真菌性病害,主要危害叶片',
                    category: '真菌性病害',
                    image: 'images/小麦/小麦条锈病.png'
                },
                {
                    name: '小麦条锈病2',
                    description: '',
                    category: '真菌性病害',
                    image: 'images/小麦/小麦条锈病2.jpg'
                },
                {
                    name: '小麦纹枯病',
                    description: '真菌性病害,危害叶鞘和茎秆',
                    category: '真菌性病害',
                    image: 'images/小麦/小麦纹枯病.jpg'
                },
                {
                    name: '小麦茎基腐病',
                    description: '真菌性病害,危害茎基部',
                    category: '真菌性病害',
                    image: 'images/小麦/小麦茎基腐病.jpg'
                },
                {
                    name: '小麦蚜虫',
                    description: '虫害,吸食叶片汁液',
                    category: '虫害',
                    image: 'images/小麦/小麦蚜虫.jpg'
                },
                {
                    name: '小麦红蜘蛛',
                    description: '虫害,吸食叶片汁液',
                    category: '虫害',
                    image: 'images/小麦/小麦红蜘蛛虫害.jpg'
                }
            ]
        },
        corn: {
            title: '玉米病虫害识别',
            diseases: [
                {
                    name: '玉米大斑病',
                    description: '真菌性病害,主要危害叶片',
                    category: '真菌性病害',
                    image: 'images/玉米/玉米大斑病.jpg'
                },
                {
                    name: '玉米螟',
                    description: '虫害,幼虫蛀食茎秆和穗部',
                    category: '虫害',
                    image: 'images/玉米/玉米螟.jpg'
                },
                {
                    name: '玉米螟2',
                    description: '',
                    category: '虫害',
                    image: 'images/玉米/玉米螟2.jpg'
                },
                {
                    name: '玉米螟3',
                    description: '',
                    category: '虫害',
                    image: 'images/玉米/玉米螟3.jpg'
                },
                {
                    name: '玉米螟4',
                    description: '',
                    category: '虫害',
                    image: 'images/玉米/玉米螟4.jpg'
                },
                {
                    name: '',
                    description: '',
                    category: '',
                    image: 'images/玉米/96fec246dac8a4c86dff6f73dc0af400.jpg'
                }
            ]
        },
        soybean: {
            title: '大豆病虫害识别',
            diseases: [
                {
                    name: '大豆菜青虫',
                    description: '虫害,幼虫取食叶片',
                    category: '虫害',
                    image: 'images/大豆/大豆菜青虫.jpg'
                },
                {
                    name: '大豆菜青虫2',
                    description: '',
                    category: '虫害',
                    image: 'images/大豆/大豆菜青虫2.jpg'
                },
                {
                    name: '大豆蚜虫',
                    description: '虫害,吸食叶片汁液',
                    category: '虫害',
                    image: 'images/大豆/大豆蚜虫.jpg'
                },
                {
                    name: '大豆蚜虫2',
                    description: '',
                    category: '虫害',
                    image: 'images/大豆/大豆蚜虫2.jpg'
                },
                {
                    name: '大豆食心虫',
                    description: '虫害,幼虫蛀食豆荚',
                    category: '虫害',
                    image: 'images/大豆/大豆食心虫.jpg'
                },
                {
                    name: '',
                    description: '',
                    category: '',
                    image: 'images/大豆/1c633e54574a614ae81fc75c5a11db11.jpg'
                }
            ]
        },
        tomato: {
            title: '番茄病虫害识别',
            diseases: [
                {
                    name: '番茄红蜘蛛',
                    description: '虫害,吸食叶片汁液',
                    category: '虫害',
                    image: 'images/番茄/番茄红蜘蛛.jpg'
                },
                {
                    name: '果蝇',
                    description: '虫害,危害果实',
                    category: '虫害',
                    image: 'images/番茄/果蝇.jpg'
                },
                {
                    name: '蛞蝓',
                    description: '虫害,取食叶片和果实',
                    category: '虫害',
                    image: 'images/番茄/蛞蝓.jpg'
                },
                {
                    name: '番茄果实蝇',
                    description: '虫害,幼虫蛀食果实',
                    category: '虫害',
                    image: 'images/番茄/番茄果实蝇.jpg'
                },
                {
                    name: '番茄果实蝇2',
                    description: '',
                    category: '虫害',
                    image: 'images/番茄/番茄果实蝇2.jpg'
                },
                {
                    name: '烟粉虱',
                    description: '虫害,吸食叶片汁液',
                    category: '虫害',
                    image: 'images/番茄/烟粉虱.jpg'
                }
            ]
        },
        cucumber: {
            title: '黄瓜病虫害识别',
            diseases: [
                {
                    name: '黄瓜白粉病',
                    description: '真菌性病害,叶片出现白粉',
                    category: '真菌性病害',
                    image: 'images/黄瓜/黄瓜白粉病.jpg'
                },
                {
                    name: '黄瓜蚜虫',
                    description: '虫害,吸食叶片汁液',
                    category: '虫害',
                    image: 'images/黄瓜/黄瓜蚜虫.jpg'
                },
                {
                    name: '黄瓜蚜虫（卵）',
                    description: '',
                    category: '虫害',
                    image: 'images/黄瓜/黄瓜蚜虫（卵）.jpg'
                },
                {
                    name: '瓜绢螟',
                    description: '虫害,幼虫取食叶片',
                    category: '虫害',
                    image: 'images/黄瓜/瓜绢螟.jpg'
                },
                {
                    name: '莴苣蚜虫',
                    description: '虫害,吸食叶片汁液',
                    category: '虫害',
                    image: 'images/黄瓜/莴苣蚜虫.jpg'
                },
                {
                    name: '瓜实蝇',
                    description: '虫害,幼虫蛀食果实',
                    category: '虫害',
                    image: 'images/黄瓜/瓜实蝇.jpg'
                }
            ]
        },
        cotton: {
            title: '棉花病虫害识别',
            diseases: [
                {
                    name: '棉花黑曲霉病',
                    description: '真菌性病害,危害棉铃',
                    category: '真菌性病害',
                    image: 'images/棉花/棉花黑曲霉病.jpg'
                },
                {
                    name: '棉红蝽',
                    description: '虫害,吸食棉铃汁液',
                    category: '虫害',
                    image: 'images/棉花/棉红蝽.jpg'
                },
                {
                    name: '棉红蝽2',
                    description: '',
                    category: '虫害',
                    image: 'images/棉花/棉红蝽2.jpg'
                },
                {
                    name: '棉蚜',
                    description: '虫害,吸食叶片汁液',
                    category: '虫害',
                    image: 'images/棉花/棉蚜.jpg'
                },
                {
                    name: '广翅蜡蝉若虫',
                    description: '虫害,若虫吸食汁液',
                    category: '虫害',
                    image: 'images/棉花/广翅蜡蝉若虫.jpg'
                },
                {
                    name: '广翅蜡蝉若虫2',
                    description: '',
                    category: '虫害',
                    image: 'images/棉花/广翅蜡蝉若虫2.jpg'
                },
                {
                    name: '棉花叶蝉',
                    description: '虫害,吸食叶片汁液',
                    category: '虫害',
                    image: 'images/棉花/棉花叶蝉虫害.jpg'
                },
                {
                    name: '棉花卷叶病毒',
                    description: '病毒性病害,导致叶片卷曲',
                    category: '病毒性病害',
                    image: 'images/棉花/棉花卷叶病毒.jpg'
                }
            ]
        },
        grape: {
            title: '葡萄病虫害识别',
            diseases: [
                {
                    name: '葡萄黑痘病',
                    description: '真菌性病害,危害叶片和果实',
                    category: '真菌性病害',
                    image: 'images/葡萄/葡萄黑痘病.jpg'
                },
                {
                    name: '葡萄瘿螨',
                    description: '虫害,危害叶片',
                    category: '虫害',
                    image: 'images/葡萄/葡萄瘿螨.jpg'
                },
                {
                    name: '葡萄瘿螨2',
                    description: '',
                    category: '虫害',
                    image: 'images/葡萄/葡萄瘿螨2.jpg'
                },
                {
                    name: '葡萄十星瓢虫',
                    description: '虫害,取食叶片',
                    category: '虫害',
                    image: 'images/葡萄/葡萄十星瓢虫.jpg'
                },
                {
                    name: '葡萄红蜘蛛',
                    description: '虫害,吸食叶片汁液',
                    category: '虫害',
                    image: 'images/葡萄/葡萄红蜘蛛.jpg'
                },
                {
                    name: '葡萄丽金龟',
                    description: '虫害,取食叶片和果实',
                    category: '虫害',
                    image: 'images/葡萄/葡萄丽金龟.jpg'
                }
            ]
        }
    };

    /**
     * 现实常见病虫害知识图谱分类（不依赖页面数据）
     */
    const knowledgeGraphTaxonomy = {
        rootName: '农作物病虫害',
        diseaseCategories: {
            '真菌性病害': [
                '水稻稻瘟病',
                '小麦条锈病',
                '玉米大斑病',
                '马铃薯晚疫病',
                '苹果黑星病',
                '葡萄白腐病',
                '油菜菌核病',
                '草莓灰霉病',
                '香蕉叶斑病',
                '黄瓜白粉病'
            ],
            '细菌性病害': [
                '水稻白叶枯病',
                '番茄青枯病',
                '白菜软腐病',
                '棉花细菌性萎蔫病',
                '黄瓜角斑病',
                '梨黑斑病',
                '柑橘溃疡病',
                '葡萄酸腐病'
            ],
            '病毒性病害': [
                '烟草花叶病毒病',
                '番茄花叶病毒病',
                '辣椒矮缩病',
                '黄瓜花叶病毒病',
                '玉米粗缩病',
                '水稻条纹病毒病',
                '甘薯叶病毒病'
            ],
            '线虫类病害': [
                '蔬菜根结线虫病',
                '大豆胞囊线虫病',
                '香蕉根结线虫病',
                '水稻根结线虫病',
                '花生根结线虫病'
            ],
            '生理性病害': [
                '水稻倒伏',
                '小麦干热风',
                '茶树日灼病',
                '柑橘缺镁症',
                '葡萄日灼病'
            ]
        },
        pestCategories: {
            '鳞翅目害虫': [
                '二化螟',
                '棉铃虫',
                '粘虫',
                '斜纹夜蛾',
                '菜青虫',
                '苹果蠹蛾',
                '甘蓝夜蛾'
            ],
            '同翅目害虫': [
                '稻飞虱',
                '白背飞虱',
                '小麦蚜虫',
                '桃蚜',
                '烟粉虱',
                '柑橘木虱',
                '梨木虱'
            ],
            '鞘翅目害虫': [
                '马铃薯甲虫',
                '甘蔗象甲',
                '稻象甲',
                '黄守瓜',
                '花生长足金龟',
                '玉米金针虫'
            ],
            '双翅目害虫': [
                '果蝇',
                '地蛆',
                '菜蝇',
                '蔬菜潜叶蝇',
                '葱蝇'
            ],
            '螨类害虫': [
                '苹果红蜘蛛',
                '柑橘全爪螨',
                '茶黄螨',
                '葡萄叶螨'
            ],
            '其他害虫': [
                '蝼蛄',
                '地老虎',
                '蝽象',
                '蜗牛',
                '金龟甲',
                '蝗虫'
            ]
        }
    };

    // 分类切换事件 - 更新为支持新的导航结构
    categoryItems.forEach(item => {
        item.addEventListener('click', function () {
            // 移除所有活动状态
            categoryItems.forEach(cat => cat.classList.remove('active'));
            // 添加当前活动状态
            this.classList.add('active');

            // 获取农作物类型
            const cropType = this.getAttribute('data-crop');

            // 清空搜索
            clearSearch();

            // 更新标题和内容
            if (cropData[cropType]) {
                currentCropData = cropData[cropType];
                updateContent(cropData[cropType]);
            } else {
                // 对于没有数据的农作物，显示默认信息
                currentCropData = null;
                // 标题已移除，不再更新
                showDefaultContent();
            }
        });
    });

    // 添加一级标题的悬停效果处理
    const categoryGroups = document.querySelectorAll('.category-group');
    categoryGroups.forEach(group => {
        const mainItem = group.querySelector('.category-main');
        const submenu = group.querySelector('.category-submenu');
        let hideTimeout = null;

        // 鼠标进入一级标题时显示二级菜单
        mainItem.addEventListener('mouseenter', function () {
            // 清除隐藏定时器
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }

            // 计算菜单位置
            const rect = mainItem.getBoundingClientRect();
            submenu.style.left = (rect.right + 5) + 'px';
            submenu.style.top = rect.top + 'px';
            submenu.style.display = 'block';
        });

        // 鼠标离开一级标题时延迟隐藏二级菜单
        mainItem.addEventListener('mouseleave', function () {
            hideTimeout = setTimeout(() => {
                submenu.style.display = 'none';
            }, 100);
        });

        // 鼠标进入二级菜单时保持显示
        submenu.addEventListener('mouseenter', function () {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        });

        // 鼠标离开二级菜单时隐藏
        submenu.addEventListener('mouseleave', function () {
            submenu.style.display = 'none';
        });
    });

    // “返回知识图谱”按钮
    const backToGraphBtn = document.getElementById('backToGraphBtn');

    // 当前显示的病虫害数据
    let currentDiseases = [];

    // 更新内容函数
    function updateContent(data) {
        // 标题已移除，不再更新
        currentDiseases = data.diseases;

        // 清空搜索统计
        const statsContainer = document.querySelector('.search-stats');
        if (statsContainer) {
            statsContainer.remove();
        }

        // 显示卡片网格，隐藏知识图谱和右侧核心特征
        const graphContainer = document.getElementById('knowledgeGraph');
        const diseaseGrid = document.querySelector('.disease-grid');
        const featurePanel = document.querySelector('.feature-panel');
        if (graphContainer) graphContainer.style.display = 'none';
        if (diseaseGrid) diseaseGrid.style.display = 'grid';
        if (featurePanel) featurePanel.style.display = 'none';
        if (backToGraphBtn) backToGraphBtn.style.display = 'inline-flex';

        renderAllCards();
    }

    // 渲染所有卡片（滚动展示）
    function renderAllCards() {
        const diseaseGrid = document.querySelector('.disease-grid');
        if (!diseaseGrid) return;

        diseaseGrid.innerHTML = '';
        diseaseGrid.style.display = 'grid';

        // 渲染所有病虫害卡片
        currentDiseases.forEach(disease => {
            const diseaseCard = createDiseaseCard(disease);
            diseaseGrid.appendChild(diseaseCard);
        });

        // 重新初始化视差效果
        initImageParallaxForCards();
    }

    // 创建病虫害卡片
    function createDiseaseCard(disease) {
        const card = document.createElement('div');
        card.className = 'disease-card';

        // 对于非中文名的图片（name为空），只显示图片，不显示详情按钮
        const hasName = disease.name && disease.name.trim() !== '';
        const displayName = hasName ? disease.name : '图片';
        const displayDescription = hasName ? (disease.description || '') : '';
        const showDetailsBtn = hasName ? `<button class="view-details-btn" data-disease-name="${disease.name}">查看详情</button>` : '';

        card.innerHTML = `
            <div class="card-image">
                <img src="${disease.image}" alt="${displayName}" class="disease-image" loading="lazy" onerror="this.src='images/placeholder.jpg'">
                ${hasName ? `
                <div class="card-overlay">
                    <div class="overlay-content">
                        <h3 class="disease-name">${disease.name}</h3>
                        <p class="disease-description">${disease.description || ''}</p>
                        ${showDetailsBtn}
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        // 只有有名称的才添加点击事件监听器
        if (hasName) {
            const viewDetailsBtn = card.querySelector('.view-details-btn');
            if (viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    showDetails(disease.name);
                });
            }
        }

        return card;
    }

    // 显示默认内容
    function showDefaultContent() {
        const diseaseGrid = document.querySelector('.disease-grid');
        const graphContainer = document.getElementById('knowledgeGraph');
        const featurePanel = document.querySelector('.feature-panel');

        // 作物页面（即使暂无数据）只展示占位提示，不展示知识图谱和核心特征
        if (graphContainer) graphContainer.style.display = 'none';
        if (featurePanel) featurePanel.style.display = 'none';
        if (diseaseGrid) diseaseGrid.style.display = 'grid';
        if (backToGraphBtn) backToGraphBtn.style.display = 'inline-flex';

        diseaseGrid.innerHTML = `
            <div class="no-content">
                <p>该农作物的病虫害信息正在完善中...</p>
            </div>
        `;
    }

    // 全局搜索功能
    let currentCropData = null;
    let allDiseasesData = [];

    // 构建全局病虫害数据
    function buildGlobalDiseasesData() {
        allDiseasesData = [];
        Object.keys(cropData).forEach(cropType => {
            const crop = cropData[cropType];
            crop.diseases.forEach(disease => {
                allDiseasesData.push({
                    ...disease,
                    cropType: cropType,
                    cropName: crop.title.replace('病虫害识别', '')
                });
            });
        });
    }

    // 编辑距离算法（Levenshtein Distance）
    function levenshteinDistance(str1, str2) {
        const matrix = [];
        const len1 = str1.length;
        const len2 = str2.length;

        // 初始化矩阵
        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }

        // 计算编辑距离
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,     // 删除
                        matrix[i][j - 1] + 1,     // 插入
                        matrix[i - 1][j - 1] + 1  // 替换
                    );
                }
            }
        }

        return matrix[len1][len2];
    }

    // 计算相似度（基于编辑距离）
    function calculateSimilarity(str1, str2) {
        const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
        const maxLength = Math.max(str1.length, str2.length);
        return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
    }

    // Jaccard相似度计算
    function jaccardSimilarity(str1, str2) {
        const set1 = new Set(str1.toLowerCase().split(''));
        const set2 = new Set(str2.toLowerCase().split(''));

        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);

        return intersection.size / union.size;
    }

    // Soundex算法（简化版）
    function soundex(str) {
        const s = str.toLowerCase().replace(/[^a-z]/g, '');
        if (!s) return '';

        const codes = {
            'b': '1', 'f': '1', 'p': '1', 'v': '1',
            'c': '2', 'g': '2', 'j': '2', 'k': '2', 'q': '2', 's': '2', 'x': '2', 'z': '2',
            'd': '3', 't': '3',
            'l': '4',
            'm': '5', 'n': '5',
            'r': '6'
        };

        let result = s[0].toUpperCase();
        let prevCode = '';

        for (let i = 1; i < s.length && result.length < 4; i++) {
            const code = codes[s[i]] || '';
            if (code && code !== prevCode) {
                result += code;
            }
            prevCode = code;
        }

        return result.padEnd(4, '0');
    }

    // 农业术语错误映射规则
    const agriculturalRules = {
        '稻温病': '稻瘟病',
        '稻瘟': '稻瘟病',
        '粘虫': '黏虫',
        '叶蝉': '叶婵',
        '赤髯龙': '赤髯蝾',
        '赤髯蝾': '赤髯龙',
        '白粉': '白粉病',
        '病毒': '病毒病',
        '真菌': '真菌性病害',
        '细菌': '细菌性病害',
        '虫害': '害虫',
        '病害': '病害'
    };

    // 预处理搜索词
    function preprocessSearchTerm(term) {
        let processedTerm = term.toLowerCase().trim();

        // 新增：将"的病""的出现"这类后缀统一处理为核心特征
        processedTerm = processedTerm.replace(/的病$/, '');
        processedTerm = processedTerm.replace(/的出现$/, '');

        // 应用农业术语规则（保持原始搜索词不变）
        for (const [wrong, correct] of Object.entries(agriculturalRules)) {
            if (processedTerm.includes(wrong)) {
                processedTerm = processedTerm.replace(wrong, correct);
            }
        }

        return processedTerm;
    }

    // 智能搜索词分解
    function decomposeSearchTerm(term) {
        const originalTerm = term.toLowerCase().trim();
        const terms = [];

        // 1. 添加完整搜索词
        terms.push(originalTerm);

        // 2. 分解为关键词（改进分词逻辑）
        const keywords = originalTerm.split(/[\s，,。.！!？?]/).filter(k => k.length > 0);
        terms.push(...keywords);

        // 3. 提取核心词汇（减少停用词，保留更多关键词）
        const stopWords = ['的', '是', '在', '和', '与', '或', '但', '而', '了', '着', '过'];
        const coreWords = keywords.filter(word => !stopWords.includes(word));
        terms.push(...coreWords);

        // 4. 添加农业术语规则处理后的词汇
        const processedTerm = preprocessSearchTerm(originalTerm);
        if (processedTerm !== originalTerm) {
            terms.push(processedTerm);
        }

        // 5. 添加同义词和近义词（强化双向映射）
        const synonyms = {
            '斑': ['斑点', '斑病', '条斑', '褐斑', '黑斑', '病斑'],
            '斑点': ['斑', '斑病', '条斑', '褐斑', '黑斑', '病斑'],
            '叶片': ['叶子', '叶', '叶片'],
            '叶子': ['叶片', '叶'],
            '叶': ['叶片', '叶子'],
            '病': ['病害', '疾病', '病症'],
            '病害': ['病', '疾病', '病症'],
            '有': ['出现', '产生', '发生', '显示'],
            '出现': ['有', '产生', '发生', '显示'], // 新增：反向映射
            '产生': ['有', '出现', '发生', '显示'],
            '发生': ['有', '出现', '产生', '显示'],
            '显示': ['有', '出现', '产生', '发生']
        };

        // 为每个核心词添加同义词
        coreWords.forEach(word => {
            if (synonyms[word]) {
                terms.push(...synonyms[word]);
            }
        });

        // 5.5. 特征词强化（聚焦"叶片""斑点"等关键特征）
        const keyFeatures = ['叶片', '叶子', '叶', '斑点', '斑', '病斑'];
        const featureWords = coreWords.filter(word =>
            keyFeatures.some(f => f.includes(word) || word.includes(f))
        );
        // 确保特征词被优先添加（重复添加以提高权重）
        if (featureWords.length > 0) {
            terms.push(...featureWords); // 重复添加，提升后续匹配优先级
        }

        // 6. 添加组合词（如"叶片斑"、"斑病"等）
        if (coreWords.length >= 2) {
            for (let i = 0; i < coreWords.length - 1; i++) {
                terms.push(coreWords[i] + coreWords[i + 1]);
            }
        }

        // 去重并返回
        return [...new Set(terms)];
    }

    // 计算综合相似度分数
    function calculateComprehensiveScore(searchTerm, item, allDocuments = []) {
        const processedTerm = preprocessSearchTerm(searchTerm);
        const originalTerm = searchTerm.toLowerCase().trim();

        let totalScore = 0;
        let maxScore = 0;

        // 1. 名称匹配（权重最高）
        const nameSimilarity = calculateSimilarity(originalTerm, item.name);
        const nameJaccard = jaccardSimilarity(originalTerm, item.name);
        const nameScore = (nameSimilarity * 0.7 + nameJaccard * 0.3) * 5;
        totalScore += nameScore;
        maxScore += 5;

        // 2. 完全匹配奖励
        if (item.name.toLowerCase() === originalTerm) {
            totalScore += 3;
            maxScore += 3;
        }

        // 3. 包含匹配
        if (item.name.toLowerCase().includes(originalTerm)) {
            totalScore += 2;
            maxScore += 2;
        }

        // 4. 描述匹配（使用TF-IDF + 余弦相似度，提高权重）
        const descSimilarity = calculateSimilarity(originalTerm, item.description);
        const descTFIDFSimilarity = calculateTextSimilarity(originalTerm, item.description, allDocuments);
        const descScore = (descSimilarity * 0.6 + descTFIDFSimilarity * 0.4) * 3; // 从2提高到3
        totalScore += descScore;
        maxScore += 3; // 同步调整总分上限

        // 5. 分类匹配
        const categorySimilarity = calculateSimilarity(originalTerm, item.category);
        const categoryScore = categorySimilarity * 1.5;
        totalScore += categoryScore;
        maxScore += 1.5;

        // 6. 作物名称匹配
        const cropSimilarity = calculateSimilarity(originalTerm, item.cropName);
        const cropScore = cropSimilarity * 1;
        totalScore += cropScore;
        maxScore += 1;

        // 7. Soundex匹配（处理发音相似）
        const searchSoundex = soundex(originalTerm);
        const itemSoundex = soundex(item.name);
        if (searchSoundex === itemSoundex && searchSoundex !== '') {
            totalScore += 1;
            maxScore += 1;
        }

        // 8. 长文本语义匹配（针对详细描述）
        if (item.description && item.description.length > 20) {
            const semanticSimilarity = calculateTextSimilarity(originalTerm, item.description, allDocuments);
            const semanticScore = semanticSimilarity * 1.5;
            totalScore += semanticScore;
            maxScore += 1.5;
        }

        return {
            score: totalScore,
            maxScore: maxScore,
            normalizedScore: totalScore / maxScore,
            nameSimilarity: nameSimilarity,
            descSimilarity: descSimilarity,
            descTFIDFSimilarity: descTFIDFSimilarity,
            categorySimilarity: categorySimilarity,
            cropSimilarity: cropSimilarity,
            semanticSimilarity: item.description && item.description.length > 20 ?
                calculateTextSimilarity(originalTerm, item.description, allDocuments) : 0
        };
    }

    // TF-IDF算法实现
    function calculateTFIDF(term, document, allDocuments) {
        // 计算词频（TF）
        const words = document.toLowerCase().split(/\s+/);
        const termCount = words.filter(word => word === term.toLowerCase()).length;
        const tf = termCount / words.length;

        // 计算逆文档频率（IDF）
        const documentsContainingTerm = allDocuments.filter(doc =>
            doc.toLowerCase().includes(term.toLowerCase())
        ).length;
        const idf = Math.log(allDocuments.length / (documentsContainingTerm + 1));

        return tf * idf;
    }

    // 余弦相似度计算
    function cosineSimilarity(vec1, vec2) {
        if (vec1.length !== vec2.length) return 0;

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }

        if (norm1 === 0 || norm2 === 0) return 0;

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    // 文本向量化（基于TF-IDF）
    function vectorizeText(text, vocabulary, allDocuments) {
        const vector = [];
        for (const term of vocabulary) {
            vector.push(calculateTFIDF(term, text, allDocuments));
        }
        return vector;
    }

    // 构建词汇表
    function buildVocabulary(documents) {
        const vocabulary = new Set();
        documents.forEach(doc => {
            const words = doc.toLowerCase().split(/\s+/);
            words.forEach(word => {
                if (word.length > 1) { // 过滤单字符
                    vocabulary.add(word);
                }
            });
        });
        return Array.from(vocabulary);
    }

    // 计算文本相似度（基于TF-IDF + 余弦相似度）
    function calculateTextSimilarity(text1, text2, allDocuments) {
        const documents = [text1, text2, ...allDocuments];
        const vocabulary = buildVocabulary(documents);

        const vec1 = vectorizeText(text1, vocabulary, documents);
        const vec2 = vectorizeText(text2, vocabulary, documents);

        return cosineSimilarity(vec1, vec2);
    }

    // 完善的模糊搜索函数
    function fuzzySearch(keyword, dataList) {
        if (!keyword) return dataList;

        const originalSearchTerm = keyword.toLowerCase().trim();
        const searchTerms = decomposeSearchTerm(originalSearchTerm);
        const threshold = 0.1; // 进一步降低阈值，确保包含更多相关结果

        console.log('搜索词分解:', searchTerms); // 调试信息

        // 构建所有文档的集合（用于TF-IDF计算）
        const allDocuments = dataList.map(item =>
            `${item.name} ${item.description} ${item.category} ${item.cropName}`
        );

        // 计算每个项目的相似度分数
        const scoredItems = dataList.map(item => {
            let maxScore = 0;
            let bestScoreData = null;

            // 对每个搜索词计算相似度，取最高分
            for (const searchTerm of searchTerms) {
                const scoreData = calculateComprehensiveScore(searchTerm, item, allDocuments);
                if (scoreData.normalizedScore > maxScore) {
                    maxScore = scoreData.normalizedScore;
                    bestScoreData = scoreData;
                }
            }

            return {
                ...item,
                similarityScore: maxScore,
                scoreDetails: bestScoreData,
                matchedTerms: searchTerms.filter(term =>
                    item.name.toLowerCase().includes(term) ||
                    item.description.toLowerCase().includes(term) ||
                    item.category.toLowerCase().includes(term) ||
                    item.cropName.toLowerCase().includes(term)
                )
            };
        });

        // 过滤低相似度结果（更宽松的条件）
        const filteredItems = scoredItems.filter(item => {
            const passesThreshold = item.similarityScore >= threshold;
            const hasMatchedTerms = item.matchedTerms.length > 0;
            const hasAgriculturalRules = Object.keys(agriculturalRules).some(wrong =>
                searchTerms.some(term => term.includes(wrong)) &&
                item.name.toLowerCase().includes(agriculturalRules[wrong])
            );
            const hasKeywordMatch = searchTerms.some(term =>
                item.name.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term) ||
                item.category.toLowerCase().includes(term) ||
                item.cropName.toLowerCase().includes(term)
            );

            const passes = passesThreshold || hasMatchedTerms || hasAgriculturalRules || hasKeywordMatch;

            // 调试信息
            if (item.similarityScore >= 0.1) {
                console.log(`项目: ${item.name}, 相似度: ${(item.similarityScore * 100).toFixed(1)}%, 通过阈值: ${passesThreshold}, 匹配词汇: ${hasMatchedTerms}, 农业规则: ${hasAgriculturalRules}, 关键词匹配: ${hasKeywordMatch}, 最终通过: ${passes}`);
            }

            return passes;
        });

        console.log('过滤后结果数量:', filteredItems.length); // 调试信息

        // 智能排序算法
        return filteredItems.sort((a, b) => {
            // 0. 新增：判断是否同时匹配"叶片"和"斑点"相关词
            const aHasBoth = a.matchedTerms.some(t => ['叶片', '叶子', '叶'].includes(t)) &&
                a.matchedTerms.some(t => ['斑', '斑点', '病斑'].includes(t));
            const bHasBoth = b.matchedTerms.some(t => ['叶片', '叶子', '叶'].includes(t)) &&
                b.matchedTerms.some(t => ['斑', '斑点', '病斑'].includes(t));

            if (aHasBoth && !bHasBoth) return -1; // 同时匹配的排前面
            if (!aHasBoth && bHasBoth) return 1;

            // 1. 首先按综合相似度分数排序
            const scoreDiff = Math.abs(a.similarityScore - b.similarityScore);
            if (scoreDiff > 0.05) {
                return b.similarityScore - a.similarityScore;
            }

            // 2. 按匹配的搜索词数量排序
            if (a.matchedTerms.length !== b.matchedTerms.length) {
                return b.matchedTerms.length - a.matchedTerms.length;
            }

            // 3. 相似度相近时，优先显示完全匹配
            const aExactMatch = searchTerms.some(term => a.name.toLowerCase() === term);
            const bExactMatch = searchTerms.some(term => b.name.toLowerCase() === term);
            if (aExactMatch && !bExactMatch) return -1;
            if (!aExactMatch && bExactMatch) return 1;

            // 4. 优先显示包含匹配
            const aContainsMatch = searchTerms.some(term => a.name.toLowerCase().includes(term));
            const bContainsMatch = searchTerms.some(term => b.name.toLowerCase().includes(term));
            if (aContainsMatch && !bContainsMatch) return -1;
            if (!aContainsMatch && bContainsMatch) return 1;

            // 5. 按名称长度排序（更精确的匹配优先）
            const aNameLength = a.name.length;
            const bNameLength = b.name.length;
            if (Math.abs(aNameLength - bNameLength) > 2) {
                return aNameLength - bNameLength;
            }

            // 6. 按语义相似度排序
            if (a.scoreDetails.semanticSimilarity !== b.scoreDetails.semanticSimilarity) {
                return b.scoreDetails.semanticSimilarity - a.scoreDetails.semanticSimilarity;
            }

            // 7. 最后按字母顺序排序
            return a.name.localeCompare(b.name);
        });
    }

    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    let searchTimeout;

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.trim();

        // 防抖处理
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(searchTerm);
        }, 300);
    });

    // 执行搜索
    function performSearch(searchTerm) {
        if (!searchTerm) {
            // 如果搜索框为空，显示知识图谱
            const graphContainer = document.getElementById('knowledgeGraph');
            const diseaseGrid = document.querySelector('.disease-grid');
            if (graphContainer) graphContainer.style.display = 'block';
            if (diseaseGrid) diseaseGrid.style.display = 'none';

            // 清空搜索统计
            const statsContainer = document.querySelector('.search-stats');
            if (statsContainer) {
                statsContainer.remove();
            }
            return;
        }

        // 在全局数据中搜索
        const searchResults = fuzzySearch(searchTerm, allDiseasesData);

        if (searchResults.length > 0) {
            // 显示搜索结果
            displaySearchResults(searchResults, searchTerm);
        } else {
            // 显示无结果提示
            displayNoResults(searchTerm);
        }
    }

    // 显示搜索结果
    function displaySearchResults(results, searchTerm) {
        // 标题已移除，不再更新

        // 设置当前显示的病虫害数据
        currentDiseases = results;

        // 显示卡片网格，隐藏知识图谱和核心特征
        const graphContainer = document.getElementById('knowledgeGraph');
        const diseaseGrid = document.querySelector('.disease-grid');
        const featurePanel = document.querySelector('.feature-panel');
        if (graphContainer) graphContainer.style.display = 'none';
        if (diseaseGrid) diseaseGrid.style.display = 'grid';
        if (featurePanel) featurePanel.style.display = 'none';
        if (backToGraphBtn) backToGraphBtn.style.display = 'inline-flex';

        // 渲染所有搜索结果卡片
        renderSearchResultsAll(searchTerm);

        // 添加搜索统计信息
        addSearchStats(results, searchTerm);

        // 添加算法调试信息（可选）
        addSearchDebugInfo(results, searchTerm);
    }

    // 添加搜索调试信息（已禁用）
    function addSearchDebugInfo(results, searchTerm) {
        // 移除之前的调试信息
        const existingDebug = document.querySelector('.search-debug');
        if (existingDebug) {
            existingDebug.remove();
        }

        // 调试信息已完全禁用，只显示搜索结果
    }

    // 渲染所有搜索结果卡片（滚动展示）
    function renderSearchResultsAll(searchTerm) {
        const diseaseGrid = document.querySelector('.disease-grid');
        diseaseGrid.innerHTML = '';

        // 渲染所有搜索结果卡片
        currentDiseases.forEach(disease => {
            const diseaseCard = createSearchResultCard(disease, searchTerm);
            diseaseGrid.appendChild(diseaseCard);
        });

        // 重新初始化视差效果
        initImageParallaxForCards();

        // 重新添加调试信息（如果存在）
        if (currentDiseases && currentDiseases.length > 0) {
            addSearchDebugInfo(currentDiseases, searchTerm);
        }
    }

    // 创建搜索结果卡片
    function createSearchResultCard(disease, searchTerm) {
        const card = document.createElement('div');
        card.className = 'disease-card search-result-card';

        // 对于非中文名的图片（name为空），只显示图片，不显示详情按钮
        const hasName = disease.name && disease.name.trim() !== '';
        const displayName = hasName ? disease.name : '图片';
        const highlightedName = hasName ? highlightText(disease.name, searchTerm) : '图片';
        const highlightedDesc = hasName ? highlightText(disease.description || '', searchTerm) : '';
        const highlightedCategory = hasName ? highlightText(disease.category || '', searchTerm) : '';
        const showDetailsBtn = hasName ? `<button class="view-details-btn" data-disease-name="${disease.name}">查看详情</button>` : '';

        card.innerHTML = `
            <div class="card-image">
                <img src="${disease.image}" alt="${displayName}" class="disease-image" loading="lazy" onerror="this.src='images/placeholder.jpg'">
                ${hasName ? `
                <div class="card-overlay">
                    <div class="overlay-content">
                        <h3 class="disease-name">${highlightedName}</h3>
                        <p class="disease-description">${highlightedDesc}</p>
                        ${showDetailsBtn}
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        // 只有有名称的才添加点击事件监听器
        if (hasName) {
            const viewDetailsBtn = card.querySelector('.view-details-btn');
            if (viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    showDetails(disease.name);
                });
            }
        }

        return card;
    }

    // 高亮文本
    function highlightText(text, searchTerm) {
        if (!searchTerm) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    // 显示无结果
    function displayNoResults(searchTerm) {
        // 标题已移除，不再更新

        // 显示卡片网格，隐藏知识图谱和核心特征
        const graphContainer = document.getElementById('knowledgeGraph');
        const diseaseGrid = document.querySelector('.disease-grid');
        const featurePanel = document.querySelector('.feature-panel');
        if (graphContainer) graphContainer.style.display = 'none';
        if (diseaseGrid) diseaseGrid.style.display = 'grid';
        if (featurePanel) featurePanel.style.display = 'none';
        if (backToGraphBtn) backToGraphBtn.style.display = 'inline-flex';

        diseaseGrid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>未找到相关结果</h3>
                <p>没有找到包含 "<strong>${searchTerm}</strong>" 的病虫害信息</p>
                <div class="search-suggestions">
                    <p>搜索建议：</p>
                    <ul>
                        <li>检查拼写是否正确</li>
                        <li>尝试使用更简单的关键词</li>
                        <li>尝试搜索病虫害的分类（如：真菌性病害、鳞翅目害虫）</li>
                        <li>尝试搜索作物名称</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // 添加搜索统计信息
    function addSearchStats(results, searchTerm) {
        const statsContainer = document.querySelector('.search-stats');
        if (statsContainer) {
            statsContainer.remove();
        }

        const stats = document.createElement('div');
        stats.className = 'search-stats';

        // 统计各作物类型的数量
        const cropStats = {};
        results.forEach(disease => {
            cropStats[disease.cropName] = (cropStats[disease.cropName] || 0) + 1;
        });

        let statsHTML = '<div class="stats-content">';
        statsHTML += `<p>搜索 "<strong>${searchTerm}</strong>" 的结果分布：</p>`;
        statsHTML += '<div class="crop-stats">';

        Object.keys(cropStats).forEach(cropName => {
            statsHTML += `<span class="stat-item">${cropName}: ${cropStats[cropName]}个</span>`;
        });

        statsHTML += '</div></div>';
        stats.innerHTML = statsHTML;

        const contentArea = document.querySelector('.content-area');
        contentArea.appendChild(stats);
    }

    // 清空搜索
    function clearSearch() {
        searchInput.value = '';

        // 显示知识图谱和核心特征，隐藏卡片网格
        const graphContainer = document.getElementById('knowledgeGraph');
        const diseaseGrid = document.querySelector('.disease-grid');
        const featurePanel = document.querySelector('.feature-panel');
        if (graphContainer) graphContainer.style.display = 'block';
        if (diseaseGrid) diseaseGrid.style.display = 'none';
        if (featurePanel) featurePanel.style.display = 'flex';

        // 隐藏返回知识图谱按钮
        if (backToGraphBtn) {
            backToGraphBtn.style.display = 'none';
        }

        const statsContainer = document.querySelector('.search-stats');
        if (statsContainer) {
            statsContainer.remove();
        }
    }

    // 返回知识图谱按钮点击事件
    if (backToGraphBtn) {
        backToGraphBtn.addEventListener('click', function () {
            clearSearch();
        });
    }

    // 清空搜索按钮已移除

    // 查看详情功能
    window.showDetails = function (diseaseName) {
        console.log('尝试显示详情:', diseaseName); // 调试信息

        // 如果diseaseName为空，不显示详情
        if (!diseaseName || diseaseName.trim() === '') {
            return;
        }

        // 查找对应的病虫害数据
        let diseaseData = null;
        Object.keys(cropData).forEach(cropType => {
            const crop = cropData[cropType];
            if (crop && crop.diseases) {
                const found = crop.diseases.find(disease => disease.name === diseaseName);
                if (found) {
                    diseaseData = found;
                    console.log('找到病虫害数据:', found); // 调试信息
                }
            }
        });

        if (!diseaseData) {
            console.error('未找到病虫害数据:', diseaseName); // 调试信息
            alert('未找到该病虫害的详细信息');
            return;
        }

        // 显示弹窗
        showDiseaseDetailModal(diseaseData);
    };

    // 显示病虫害详情弹窗
    function showDiseaseDetailModal(diseaseData) {
        const modal = document.getElementById('diseaseDetailModal');
        const modalTitle = document.getElementById('modalTitle');

        // 检查元素是否存在
        if (!modal) {
            console.error('弹窗元素未找到');
            return;
        }

        if (!modalTitle) {
            console.error('弹窗标题元素未找到');
            return;
        }

        // 设置标题
        modalTitle.textContent = diseaseData.name + ' - 详细信息';

        // 填充基础信息
        if (diseaseData.details) {
            const details = diseaseData.details;

            // 基础属性
            if (details.basicInfo) {
                const diseaseTypeEl = document.getElementById('diseaseType');
                const pathogenEl = document.getElementById('pathogen');
                const aliasesEl = document.getElementById('aliases');
                const hostEl = document.getElementById('host');

                if (diseaseTypeEl) diseaseTypeEl.textContent = details.basicInfo.diseaseType || '暂无信息';
                if (pathogenEl) pathogenEl.textContent = details.basicInfo.pathogen || '暂无信息';
                if (aliasesEl) aliasesEl.textContent = details.basicInfo.aliases || '暂无信息';
                if (hostEl) hostEl.textContent = details.basicInfo.host || '暂无信息';
            }

            // 发生规律
            if (details.occurrence) {
                const seasonEl = document.getElementById('season');
                const conditionsEl = document.getElementById('conditions');
                const transmissionEl = document.getElementById('transmission');
                const criticalPeriodEl = document.getElementById('criticalPeriod');

                if (seasonEl) seasonEl.textContent = details.occurrence.season || '暂无信息';
                if (conditionsEl) conditionsEl.textContent = details.occurrence.conditions || '暂无信息';
                if (transmissionEl) transmissionEl.textContent = details.occurrence.transmission || '暂无信息';
                if (criticalPeriodEl) criticalPeriodEl.textContent = details.occurrence.criticalPeriod || '暂无信息';
            }

            // 危害特征
            if (details.symptoms) {
                const symptomsContainer = document.getElementById('symptoms');
                if (symptomsContainer) {
                    symptomsContainer.innerHTML = '';

                    details.symptoms.forEach(symptom => {
                        const symptomItem = document.createElement('div');
                        symptomItem.className = 'symptom-item';
                        symptomItem.innerHTML = `
                            <h4>${symptom.part}</h4>
                            <p><strong>典型症状：</strong>${symptom.description}</p>
                            <p><strong>危害程度：</strong>${symptom.severity}</p>
                        `;
                        symptomsContainer.appendChild(symptomItem);
                    });
                }
            }

            // 防治措施
            if (details.prevention) {
                const preventionContainer = document.getElementById('prevention');
                if (preventionContainer) {
                    preventionContainer.innerHTML = '';

                    details.prevention.forEach(prevention => {
                        const preventionItem = document.createElement('div');
                        preventionItem.className = 'prevention-item';
                        const windowClass = prevention.window && prevention.window.includes('关键') ? 'window-critical' : '';
                        preventionItem.innerHTML = `
                            <h4>${prevention.type}</h4>
                            <p><strong>具体方法：</strong>${prevention.methods}</p>
                            <p><strong>最佳窗口期：</strong><span class="${windowClass}">${prevention.window}</span></p>
                        `;
                        preventionContainer.appendChild(preventionItem);
                    });
                }
            }

            // 经济影响
            if (details.economicImpact) {
                const yieldLossEl = document.getElementById('yieldLoss');
                const controlCostEl = document.getElementById('controlCost');
                const qualityImpactEl = document.getElementById('qualityImpact');

                if (yieldLossEl) yieldLossEl.textContent = details.economicImpact.yieldLoss || '暂无信息';
                if (controlCostEl) controlCostEl.textContent = details.economicImpact.controlCost || '暂无信息';
                if (qualityImpactEl) qualityImpactEl.textContent = details.economicImpact.qualityImpact || '暂无信息';
            }

            // 监测与识别
            if (details.monitoring) {
                const monitoringEl = document.getElementById('monitoring');
                const confusionEl = document.getElementById('confusion');

                if (monitoringEl) monitoringEl.textContent = details.monitoring.methods || '暂无信息';
                if (confusionEl) confusionEl.textContent = details.monitoring.confusion || '暂无信息';
            }
        } else {
            // 如果没有详细信息，显示基本信息
            document.getElementById('diseaseType').textContent = diseaseData.category || '暂无信息';
            document.getElementById('pathogen').textContent = '暂无详细信息';
            document.getElementById('aliases').textContent = '暂无信息';
            document.getElementById('host').textContent = '暂无信息';
            document.getElementById('season').textContent = '暂无信息';
            document.getElementById('conditions').textContent = '暂无信息';
            document.getElementById('transmission').textContent = '暂无信息';
            document.getElementById('criticalPeriod').textContent = '暂无信息';
            document.getElementById('symptoms').innerHTML = '<p>暂无详细信息</p>';
            document.getElementById('prevention').innerHTML = '<p>暂无详细信息</p>';
            document.getElementById('yieldLoss').textContent = '暂无信息';
            document.getElementById('controlCost').textContent = '暂无信息';
            document.getElementById('qualityImpact').textContent = '暂无信息';
            document.getElementById('monitoring').textContent = '暂无信息';
            document.getElementById('confusion').textContent = '暂无信息';
        }

        // 显示弹窗
        modal.style.display = 'block';

        // 禁止背景滚动
        document.body.style.overflow = 'hidden';

        // 重新初始化事件监听器（确保事件绑定正确）
        initModalEvents();

        // 将焦点设置到关闭按钮，便于键盘导航
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.focus();
        }
    }

    // 关闭弹窗功能
    function closeModal() {
        const modal = document.getElementById('diseaseDetailModal');
        const modalContent = document.querySelector('.modal-content');

        if (modal && modalContent) {
            // 添加关闭动画
            modalContent.style.animation = 'slideOut 0.3s ease forwards';
            modal.style.animation = 'fadeOut 0.3s ease forwards';

            // 动画完成后隐藏弹窗
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.animation = '';
                modalContent.style.animation = '';
                document.body.style.overflow = 'auto';
            }, 300);
        } else {
            // 如果没有动画支持，直接关闭
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // 初始化弹窗事件监听器
    function initModalEvents() {
        const modal = document.getElementById('diseaseDetailModal');
        const closeBtn = document.querySelector('.close');

        // 点击关闭按钮（×）
        if (closeBtn) {
            // 移除之前的事件监听器（如果存在）
            closeBtn.removeEventListener('click', handleCloseClick);
            closeBtn.removeEventListener('keydown', handleCloseKeydown);
            closeBtn.removeEventListener('mouseenter', handleCloseMouseEnter);
            closeBtn.removeEventListener('mouseleave', handleCloseMouseLeave);

            // 添加新的事件监听器
            closeBtn.addEventListener('click', handleCloseClick);
            closeBtn.addEventListener('keydown', handleCloseKeydown);
            closeBtn.addEventListener('mouseenter', handleCloseMouseEnter);
            closeBtn.addEventListener('mouseleave', handleCloseMouseLeave);

            // 确保关闭按钮可以获得焦点
            closeBtn.setAttribute('tabindex', '0');
            closeBtn.setAttribute('role', 'button');
            closeBtn.setAttribute('aria-label', '关闭弹窗');
        }

        // 点击弹窗外部关闭
        if (modal) {
            modal.removeEventListener('click', handleModalClick);
            modal.addEventListener('click', handleModalClick);
        }

        // 防止弹窗内容区域的点击事件冒泡
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.removeEventListener('click', handleContentClick);
            modalContent.addEventListener('click', handleContentClick);
        }
    }

    // 事件处理函数
    function handleCloseClick(event) {
        event.preventDefault();
        event.stopPropagation();
        closeModal();
    }

    function handleCloseKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            closeModal();
        }
    }

    function handleCloseMouseEnter(event) {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    }

    function handleCloseMouseLeave(event) {
        this.style.backgroundColor = 'transparent';
    }

    function handleModalClick(event) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    function handleContentClick(event) {
        event.stopPropagation();
    }

    // ESC键关闭弹窗（全局事件）
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('diseaseDetailModal');
            if (modal && modal.style.display === 'block') {
                closeModal();
            }
        }
    });

    // 使用事件委托处理关闭按钮点击（更可靠的方法）
    document.addEventListener('click', function (event) {
        // 检查是否点击了关闭按钮
        if (event.target.classList.contains('close')) {
            event.preventDefault();
            event.stopPropagation();
            closeModal();
            return;
        }

        // 检查是否点击了弹窗背景
        if (event.target.id === 'diseaseDetailModal') {
            closeModal();
            return;
        }

        // 检查是否点击了查看详情按钮
        if (event.target.classList.contains('view-details-btn')) {
            event.preventDefault();
            event.stopPropagation();
            const diseaseName = event.target.getAttribute('data-disease-name');
            if (diseaseName) {
                console.log('通过事件委托点击查看详情:', diseaseName);
                showDetails(diseaseName);
            }
            return;
        }

        // 调试信息（可以删除）
        console.log('点击的元素:', event.target);
        console.log('元素的类名:', event.target.className);
        console.log('元素的ID:', event.target.id);
    });

    // 页面加载完成后初始化事件
    document.addEventListener('DOMContentLoaded', function () {
        initModalEvents();
    });

    // 添加卡片悬停效果
    document.addEventListener('mouseover', function (e) {
        if (e.target.closest('.disease-card')) {
            const card = e.target.closest('.disease-card');
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }
    });

    document.addEventListener('mouseout', function (e) {
        if (e.target.closest('.disease-card')) {
            const card = e.target.closest('.disease-card');
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
    });

    // 初始化页面
    buildGlobalDiseasesData();
    currentCropData = cropData.rice;

    // 确保知识图谱显示，卡片网格隐藏
    const graphContainer = document.getElementById('knowledgeGraph');
    const diseaseGrid = document.querySelector('.disease-grid');
    if (graphContainer) graphContainer.style.display = 'block';
    if (diseaseGrid) diseaseGrid.style.display = 'none';

    // 等待 ECharts 加载完成后再初始化知识图谱
    function initKnowledgeGraphWhenReady() {
        if (typeof echarts !== 'undefined') {
            console.log('ECharts 已加载，开始初始化知识图谱');
            initKnowledgeGraph(knowledgeGraphTaxonomy);
            return;
        }

        // 如果 ECharts 还没加载，等待一下再试（最多等待5秒）
        let attempts = 0;
        const maxAttempts = 50;
        const checkInterval = setInterval(function () {
            attempts++;
            if (typeof echarts !== 'undefined') {
                console.log('ECharts 已加载，开始初始化知识图谱');
                clearInterval(checkInterval);
                initKnowledgeGraph(knowledgeGraphTaxonomy);
            } else if (attempts >= maxAttempts) {
                console.error('ECharts 加载超时');
                clearInterval(checkInterval);
                if (graphContainer) {
                    graphContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;"><p>知识图谱加载失败，请刷新页面重试</p></div>';
                }
            }
        }, 100);
    }

    // 初始化知识图谱（默认显示）
    initKnowledgeGraphWhenReady();

    // 初始化 hover-image-parallax 效果
    initImageParallaxForCards();
});

/**
 * 初始化图片视差效果（为所有卡片）
 * 图片随鼠标移动：偏移量约为鼠标位置与中心距离的 12.5%
 * 悬停时放大：缩放至 1.15 倍
 */
function initImageParallaxForCards() {
    const cardImages = document.querySelectorAll('.card-image');

    // 使用requestAnimationFrame优化性能
    if (cardImages.length === 0) return;

    cardImages.forEach(cardImage => {
        const image = cardImage.querySelector('.disease-image');
        if (!image) return;

        // 移除旧的事件监听器（如果存在）
        const oldMousemove = cardImage._parallaxMousemove;
        const oldMouseleave = cardImage._parallaxMouseleave;
        if (oldMousemove) {
            cardImage.removeEventListener('mousemove', oldMousemove);
        }
        if (oldMouseleave) {
            cardImage.removeEventListener('mouseleave', oldMouseleave);
        }

        // 定义事件处理函数（使用节流优化性能）
        let rafId = null;
        const handleMousemove = function (e) {
            // 使用requestAnimationFrame节流，提升性能
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(() => {
                // 获取卡片图片的边界信息
                const rect = cardImage.getBoundingClientRect();

                // 计算鼠标相对于图片中心的位置
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // 计算偏移量（12.5%）
                const offsetX = (mouseX - centerX) * 0.125;
                const offsetY = (mouseY - centerY) * 0.125;

                // 应用变换：偏移 + 缩放 1.15
                image.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.15)`;
                image.style.transition = 'transform 0.1s ease-out';
            });
        };

        const handleMouseleave = function () {
            image.style.transform = 'translate(0, 0) scale(1)';
            image.style.transition = 'transform 0.3s ease';
        };

        // 保存事件处理函数的引用，以便后续移除
        cardImage._parallaxMousemove = handleMousemove;
        cardImage._parallaxMouseleave = handleMouseleave;

        // 添加事件监听器
        cardImage.addEventListener('mousemove', handleMousemove);
        cardImage.addEventListener('mouseleave', handleMouseleave);
    });
}

/**
 * 初始化知识图谱
 * @param {Object} taxonomy - 现实常见病虫害分类数据
 */
function initKnowledgeGraph(taxonomy) {
    const graphContainer = document.getElementById('knowledgeGraph');
    if (!graphContainer) {
        console.error('知识图谱容器未找到');
        return;
    }

    // 检查 ECharts 是否已加载
    if (typeof echarts === 'undefined') {
        console.error('ECharts 库未加载');
        return;
    }

    // 构建知识图谱数据
    const graphData = buildKnowledgeGraphData(taxonomy);

    // 检查数据是否有效
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
        console.error('知识图谱数据为空', graphData);
        graphContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;"><p>知识图谱数据为空</p></div>';
        return;
    }

    console.log('知识图谱数据:', {
        nodes: graphData.nodes.length,
        links: graphData.links.length,
        categories: graphData.categories.length
    });

    // 初始化 ECharts 实例
    try {
        const myChart = echarts.init(graphContainer);

        if (!myChart) {
            console.error('ECharts 实例初始化失败');
            graphContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;"><p>图表初始化失败</p></div>';
            return;
        }

        // 配置知识图谱选项
        const option = {
            title: {
                text: '知识图谱',
                left: 20,
                top: 20,
                textStyle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#00e676'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    if (params.dataType === 'node') {
                        return params.name;
                    }
                    return '';
                }
            },
            series: [{
                type: 'graph',
                layout: 'force',
                animation: true,
                data: graphData.nodes,
                links: graphData.links,
                categories: graphData.categories,
                roam: true,
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}',
                    fontSize: 40,
                    color: '#ffffff'
                },
                labelLayout: {
                    hideOverlap: true
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 4
                    }
                },
                force: {
                    repulsion: 2000,
                    gravity: 0.1,
                    edgeLength: [100, 300],
                    layoutAnimation: true
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3,
                    width: 2
                }
            }]
        };

        // 设置配置项并显示图表
        myChart.setOption(option);

        // 确保图表正确渲染
        setTimeout(function () {
            myChart.resize();
        }, 100);

        // 响应式调整
        window.addEventListener('resize', function () {
            myChart.resize();
        });

        // 点击节点事件
        myChart.on('click', function (params) {
            if (params.dataType === 'node') {
                const nodeName = params.name;
                if (params.data && params.data.category === 3) {
                    const disease = findDiseaseByName(nodeName);
                    if (disease) {
                        showDetails(nodeName);
                    } else {
                        alert(`"${nodeName}" 的详细介绍正在补充中，敬请期待。`);
                    }
                }
            }
        });

        console.log('知识图谱初始化成功');
    } catch (error) {
        console.error('知识图谱初始化出错:', error);
        graphContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;"><p>知识图谱初始化出错: ' + error.message + '</p></div>';
    }
}

/**
 * 构建知识图谱数据
 * @param {Object} taxonomy - 现实常见病虫害分类数据
 */
function buildKnowledgeGraphData(taxonomy) {
    if (!taxonomy) {
        console.error('taxonomy 未定义');
        return { nodes: [], links: [], categories: [] };
    }
    const diseaseSource = taxonomy.diseaseCategories || {};
    const pestSource = taxonomy.pestCategories || {};
    const rootName = taxonomy.rootName || '农作物病虫害';
    const nodes = [];
    const links = [];
    const categories = [
        { name: '根节点' },
        { name: '一级分类' },
        { name: '二级分类' },
        { name: '具体病虫害' }
    ];

    // 根节点
    const rootNode = {
        id: 'root',
        name: rootName,
        category: 0,
        symbolSize: 80,
        itemStyle: { color: '#4CAF50' },
        label: { fontSize: 18, fontWeight: 'bold' }
    };
    nodes.push(rootNode);

    // 一级分类：病害和虫害
    const diseaseCategory = {
        id: 'disease',
        name: '病害',
        category: 1,
        symbolSize: 60,
        itemStyle: { color: '#FF6B6B' },
        label: { fontSize: 16, fontWeight: 'bold' }
    };
    nodes.push(diseaseCategory);
    links.push({ source: 'root', target: 'disease' });

    const pestCategory = {
        id: 'pest',
        name: '虫害',
        category: 1,
        symbolSize: 60,
        itemStyle: { color: '#4ECDC4' },
        label: { fontSize: 16, fontWeight: 'bold' }
    };
    nodes.push(pestCategory);
    links.push({ source: 'root', target: 'pest' });

    // 添加病害的二级分类节点和连接
    Object.keys(diseaseSource).forEach((subcategory, index) => {
        const subcategoryId = `disease_${index}`;
        const subcategoryNode = {
            id: subcategoryId,
            name: subcategory,
            category: 2,
            symbolSize: 50,
            itemStyle: { color: '#FFB6C1' },
            label: { fontSize: 14 }
        };
        nodes.push(subcategoryNode);
        links.push({ source: 'disease', target: subcategoryId });

        // 添加具体病害节点
        diseaseSource[subcategory].forEach((diseaseName, diseaseIndex) => {
            const diseaseId = `${subcategoryId}_${diseaseIndex}`;
            const diseaseNode = {
                id: diseaseId,
                name: diseaseName,
                category: 3,
                symbolSize: 30,
                itemStyle: { color: '#FFE4E1' },
                label: { fontSize: 12 }
            };
            nodes.push(diseaseNode);
            links.push({ source: subcategoryId, target: diseaseId });
        });
    });

    // 添加虫害的二级分类节点和连接
    Object.keys(pestSource).forEach((subcategory, index) => {
        const subcategoryId = `pest_${index}`;
        const subcategoryNode = {
            id: subcategoryId,
            name: subcategory,
            category: 2,
            symbolSize: 50,
            itemStyle: { color: '#87CEEB' },
            label: { fontSize: 14 }
        };
        nodes.push(subcategoryNode);
        links.push({ source: 'pest', target: subcategoryId });

        // 添加具体虫害节点
        pestSource[subcategory].forEach((pestName, pestIndex) => {
            const pestId = `${subcategoryId}_${pestIndex}`;
            const pestNode = {
                id: pestId,
                name: pestName,
                category: 3,
                symbolSize: 30,
                itemStyle: { color: '#E0F7FA' },
                label: { fontSize: 12 }
            };
            nodes.push(pestNode);
            links.push({ source: subcategoryId, target: pestId });
        });
    });

    return { nodes, links, categories };
}

/**
 * 根据名称查找病虫害数据
 */
function findDiseaseByName(name) {
    for (const cropType in cropData) {
        const crop = cropData[cropType];
        if (crop && crop.diseases) {
            const found = crop.diseases.find(disease => disease.name === name);
            if (found) {
                return found;
            }
        }
    }
    return null;
}


