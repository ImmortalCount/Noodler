import {useState} from 'react'
import {  generateTabFromModules, turnNoteDataIntoPositionData, downloadTabAsTextFile } from '../../components/guitar/tabfunctions.js';

export default function Tab() {
    const [str, setStr] = useState('test')
    let dataFromPlayerToGuitar = [
        {
            "displayOnly": false,
            "highlight": [],
            "data": [
                {
                    "speed": 1,
                    "notes": [
                        [
                            "D3",
                            "F3"
                        ],
                        [
                            "A3",
                            "D4"
                        ],
                        [
                            "C4",
                            "B3"
                        ],
                        [
                            "A3",
                            "G3"
                        ]
                    ],
                    "position": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "speed": 1,
                    "notes": [
                        [
                            "C3",
                            "E3"
                        ],
                        [
                            "G3",
                            "C4"
                        ],
                        [
                            "B3",
                            "A3"
                        ],
                        [
                            "G3",
                            "F3"
                        ]
                    ],
                    "position": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "speed": 1,
                    "notes": [
                        [
                            "C3",
                            "E3"
                        ],
                        [
                            "G3",
                            "C4"
                        ],
                        [
                            "B3",
                            "A3"
                        ],
                        [
                            "G3",
                            "F3"
                        ]
                    ],
                    "position": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "speed": 1,
                    "notes": [
                        [
                            "G3",
                            "B3"
                        ],
                        [
                            "D4",
                            "G4"
                        ],
                        [
                            "F4",
                            "E4"
                        ],
                        [
                            "D4",
                            "C4"
                        ]
                    ],
                    "position": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "displayOnly": false,
            "highlight": [],
            "data": [
                {
                    "speed": 1,
                    "notes": [
                        [
                            "D3",
                            "F3"
                        ],
                        [
                            "A3",
                            "D4"
                        ],
                        [
                            "C4",
                            "B3"
                        ],
                        [
                            "A3",
                            "G3"
                        ]
                    ],
                    "position": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "speed": 1,
                    "notes": [
                        [
                            "C3",
                            "E3"
                        ],
                        [
                            "G3",
                            "C4"
                        ],
                        [
                            "B3",
                            "A3"
                        ],
                        [
                            "G3",
                            "F3"
                        ]
                    ],
                    "position": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "speed": 1,
                    "notes": [
                        [
                            "C3",
                            "E3"
                        ],
                        [
                            "G3",
                            "C4"
                        ],
                        [
                            "B3",
                            "A3"
                        ],
                        [
                            "G3",
                            "F3"
                        ]
                    ],
                    "position": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "speed": 1,
                    "notes": [
                        [
                            "G3",
                            "B3"
                        ],
                        [
                            "D4",
                            "G4"
                        ],
                        [
                            "F4",
                            "E4"
                        ],
                        [
                            "D4",
                            "C4"
                        ]
                    ],
                    "position": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        }
    ]
    const testTuning = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2']
    const testTuning2 = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2', 'B1']

    const testAllModulesArray = [
        {instrument: 'Instr 1', tuning: testTuning, data: [[['4_0'], ['4_3'], ['3_2'], ['2_3']],[['2_1'], ['2_0'], ['3_0'], ['2_3']],[['4_0'], ['4_3'], ['3_2'], ['2_3']],[['2_1'], ['2_0'], ['3_0'], ['2_3']], [['4_0'], ['4_3'], ['3_2'], ['2_3']],[['2_1'], ['2_0'], ['3_0'], ['2_3']],[['4_0'], ['4_3'], ['3_2'], ['4_3'], ['3_2'], ['4_3'], ['3_2'], ['4_3'], ['3_2'], ['2_3']],[['2_1'], ['2_0'], ['3_0'], ['2_3']]]},
        {instrument: 'Instr 2', tuning: testTuning2, data: [[['4_0'], ['4_3'], ['3_2'], ['2_3']],[['2_1'], ['2_0'], ['3_0'], ['2_3']],[['4_0'], ['4_3'], ['3_2'], ['2_3']],[['2_1'], ['2_0'], ['3_0'], ['2_3']], [['4_0'], ['4_3'], ['3_2'], ['2_3']],[['2_1'], ['2_0'], ['3_0'], ['2_3']],[['4_0'], ['4_3'], ['3_2'], ['2_3']],[['2_1'], ['2_0'], ['3_0'], ['2_3']]]}
    ]

    let maxwidth = '---------------------------------------------------------------------'

  return (
      <>
          <div>Tab</div>
          <button onClick={() => downloadTabAsTextFile(str, 'titleX')}>download tab</button>
          <button onClick={() => setStr(generateTabFromModules(dataFromPlayerToGuitar))}>generate tab</button>
          <button onClick={() => console.log(str)}>test</button>
      </>

  )
}
