const discs = [
// disc 0
  [
// spoke 0
    [ 0, 0, 0, 1, 1, 1, 1 ], // ring 0-6
// spoke 1
    [ 0, 1, 0, 1, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 0 ],
    [ 1, 0, 1, 1, 0, 1, 1 ],
    [ 0, 0, 0, 1, 0, 0, 0 ],
    [ 1, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1 ],
    [ 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0 ],
    [ 0, 1, 1, 0, 0, 1, 1 ],
    [ 0, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 1, 0, 1, 0, 1, 0, 0 ],
    [ 0, 1, 0, 0, 1, 0, 0 ],
    [ 1, 0, 0, 0, 1, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 1, 1 ],
    [ 0, 0, 1, 0, 0, 1, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 1, 0, 1, 1, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 1, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 1, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0 ],
    [ 0, 0, 0, 1, 1, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 0 ],
    [ 0, 0, 1, 0, 0, 1, 1 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ]
  ],
// disc 1
  [
// spoke 0
    [ 1, 0, 0, 0, 0, 1, 1 ], // ring 0-6
// spoke 1
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 1, 0, 0, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 1, 1, 1 ],
    [ 0, 1, 0, 0, 1, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 1, 1 ],
    [ 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 1, 0, 0, 0 ],
    [ 0, 1, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 1, 1 ],
    [ 0, 0, 0, 1, 0, 0, 1 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1 ]
  ],
// disc 2
  [
// spoke 0
    [ 1, 0, 0, 0, 0, 0, 0 ], // ring 0-6
// spoke 1
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 1, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 1, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0 ],
    [ 1, 0, 0, 0, 1, 1, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0 ],
    [ 0, 0, 0, 1, 1, 1, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 1, 0, 0, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 1 ]
  ]
]

module.exports = { discs };
