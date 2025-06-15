// Mock data for coaching dashboard

// Player Progress Over Time
export const areaChartData = [
  { name: 'Jan', technical: 65, physical: 70 },
  { name: 'Feb', technical: 68, physical: 72 },
  { name: 'Mar', technical: 72, physical: 75 },
  { name: 'Apr', technical: 75, physical: 78 },
  { name: 'May', technical: 78, physical: 80 },
  { name: 'Jun', technical: 80, physical: 82 },
  { name: 'Jul', technical: 82, physical: 84 },
  { name: 'Aug', technical: 85, physical: 86 },
  { name: 'Sep', technical: 87, physical: 88 },
  { name: 'Oct', technical: 89, physical: 90 },
  { name: 'Nov', technical: 91, physical: 92 },
  { name: 'Dec', technical: 93, physical: 94 },
];

// Training Sessions by Position
export const barChartData = [
  { name: 'PG', individual: 12, group: 8 },
  { name: 'SG', individual: 18, group: 15 },
  { name: 'SF', individual: 24, group: 20 },
  { name: 'PF', individual: 20, group: 16 },
  { name: 'C', individual: 16, group: 12 },
];

// Skill Development Areas
export const pieChartData = [
  { name: 'Technical', value: 35 },
  { name: 'Physical', value: 25 },
  { name: 'Mental', value: 20 },
  { name: 'Tactical', value: 20 },
];

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Weekly Observations
export const lineChartData = [
  { name: 'Week 1', observations: 15, completed: 12 },
  { name: 'Week 2', observations: 18, completed: 16 },
  { name: 'Week 3', observations: 22, completed: 20 },
  { name: 'Week 4', observations: 20, completed: 18 },
  { name: 'Week 5', observations: 25, completed: 23 },
  { name: 'Week 6', observations: 28, completed: 26 },
];

// Player Skills Radar
export const radarChartData = [
  { subject: 'Passing', A: 85, B: 70 },
  { subject: 'Three-Point', A: 78, B: 82 },
  { subject: 'Ball Handling', A: 90, B: 85 },
  { subject: 'Perimeter D', A: 65, B: 90 },
  { subject: 'Speed', A: 88, B: 92 },
  { subject: 'Basketball IQ', A: 82, B: 75 },
];

// Dashboard Stats
export const mockStats = [
  {
    title: 'Total Players',
    value: '42',
    change: '+3 this month',
    trend: 'up',
    icon: {
      path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      bgColor: 'bg-blue-500'
    }
  },
  {
    title: 'Active Coaches',
    value: '8',
    change: '+1 this week',
    trend: 'up',
    icon: {
      path: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
      bgColor: 'bg-green-500'
    }
  },
  {
    title: 'This Week Observations',
    value: '156',
    change: '+12 today',
    trend: 'up',
    icon: {
      path: 'M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      bgColor: 'bg-orange-500'
    }
  },
  {
    title: 'Active PDPs',
    value: '28',
    change: '5 due this week',
    trend: 'neutral',
    icon: {
      path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      bgColor: 'bg-purple-500'
    }
  }
];

// Mock Players Data
export const mockPlayers = [
  {
    id: 1,
    name: 'Jayden Williams',
    position: 'Point Guard',
    age: 16,
    team: 'Varsity Hustlers',
    lastObservation: '2024-06-10',
    pdpStatus: 'In Progress',
    skillLevel: 8.2
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    position: 'Shooting Guard',
    age: 15, 
    team: 'JV Lakers',
    lastObservation: '2024-06-12',
    pdpStatus: 'Review Due',
    skillLevel: 7.8
  },
  {
    id: 3,
    name: 'Deandre Thomas',
    position: 'Power Forward',
    age: 17,
    team: 'Varsity Hustlers',
    lastObservation: '2024-06-13',
    pdpStatus: 'Completed',
    skillLevel: 8.5
  },
  {
    id: 4,
    name: 'Michael Chen',
    position: 'Center',
    age: 16,
    team: 'JV Rockets',
    lastObservation: '2024-06-11',
    pdpStatus: 'In Progress',
    skillLevel: 8.9
  }
];

// Mock Coaches Data
export const mockCoaches = [
  {
    id: 1,
    name: 'Coach Johnson',
    specialization: 'Shooting Development',
    experience: '8 years',
    activeObservations: 23,
    playersAssigned: 12
  },
  {
    id: 2,
    name: 'Coach Rodriguez',
    specialization: 'Guard Skills',
    experience: '6 years',
    activeObservations: 15,
    playersAssigned: 8
  },
  {
    id: 3,
    name: 'Coach Wilson',
    specialization: 'Post Play & Rebounding',
    experience: '10 years',
    activeObservations: 18,
    playersAssigned: 15
  }
];

// Mock Observations Data
export const mockObservations = [
  // Jayden Williams Observations
  {
    id: 1,
    playerId: 1,
    playerName: 'Jayden Williams',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-06-14',
    focus: 'Pick and roll execution',
    rating: 8,
    notes: 'Excellent decision making in pick and roll situations. Created scoring opportunities for teammates and found open lanes for himself. Still needs to improve on reading when defenders go under screens.',
    actionItems: ['Work on pull-up jumpers after screen', 'Practice passing angles to rolling big men']
  },
  {
    id: 2,
    playerId: 1,
    playerName: 'Jayden Williams',
    coachId: 3,
    coachName: 'Coach Wilson',
    date: '2024-06-10',
    focus: 'Three-point shooting',
    rating: 8,
    notes: 'Excellent improvement in shooting form. Needs work on off-dribble three-pointers. Shot release is good but consistency from left wing is lacking. Made 7/10 corner threes but only 4/10 from top of key.',
    actionItems: ['Practice off-dribble threes', 'Work on balance and rhythm when shooting']
  },
  {
    id: 3,
    playerId: 1,
    playerName: 'Jayden Williams',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-06-02',
    focus: 'Playmaking and assists',
    rating: 7,
    notes: 'Good court vision and passing ability, but sometimes tries too many risky passes. Better decision making required in fast break situations. Recorded 6 assists but had 4 turnovers.',
    actionItems: ['Simple pick and roll drills', 'Video analysis of turnovers']
  },
  {
    id: 4,
    playerId: 1,
    playerName: 'Jayden Williams',
    coachId: 2,
    coachName: 'Coach Rodriguez',
    date: '2024-05-25',
    focus: 'On-ball defense',
    rating: 6,
    notes: 'Lacks intensity on defensive end. Often gets beat by quick first steps and allows too much space for jump shots. Needs to improve lateral quickness and anticipation when guarding ball handlers.',
    actionItems: ['Defensive stance drills', 'Conditioning for lateral movement speed']
  },
  {
    id: 5,
    playerId: 1,
    playerName: 'Jayden Williams',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-05-18',
    focus: 'Finishing at the rim',
    rating: 7,
    notes: 'Good body control on layups but occasionally lacks aggression when contact is made. Converting about 60% of contested layups but could improve with better use of angles and stronger drive through contact.',
    actionItems: ['Finishing through contact drills', 'Strength training for core and upper body']
  },
  {
    id: 6,
    playerId: 1,
    playerName: 'Jayden Williams',
    coachId: 3,
    coachName: 'Coach Wilson',
    date: '2024-05-10',
    focus: 'Off-ball movement',
    rating: 9,
    notes: 'Excellent movement without the ball, creating space for himself and teammates. Made intelligent cuts and was a constant scoring threat. Scored twice on backdoor cuts during scrimmage.',
    actionItems: ['Continue work on reading screens', 'Practice catch-and-shoot off movement']
  },
  {
    id: 7,
    playerId: 1,
    playerName: 'Jayden Williams',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-05-03',
    focus: 'Transition defense',
    rating: 6,
    notes: 'Needs to show more commitment getting back on defense after turnovers. Energy levels drop noticeably in the fourth quarter of games. Conditioning may be an issue.',
    actionItems: ['Interval training', 'Defensive awareness drills after offensive possessions']
  },
  {
    id: 8,
    playerId: 1,
    playerName: 'Jayden Williams',
    coachId: 3,
    coachName: 'Coach Wilson',
    date: '2024-04-28',
    focus: 'Isolation scoring',
    rating: 8,
    notes: 'Composed in one-on-one situations. Makes good decisions whether to drive to the basket or pull up for jumpers. Converting about 75% of clear scoring chances which is very good for his age group.',
    actionItems: ['Practice varying finish types', 'Work on hesitation moves to create separation']
  },

  // Marcus Johnson Observations
  {
    id: 9,
    playerId: 2,
    playerName: 'Marcus Johnson',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-06-13',
    focus: 'Catch and shoot technique',
    rating: 8,
    notes: 'Excellent mechanics on catch and shoot today. Made 12/15 open jump shots and created space well off screens. Decision making was spot on throughout. Shot 45% from three-point range during scrimmage.',
    actionItems: ['Continue work on footwork before catch', 'Quick release practice']
  },
  {
    id: 10,
    playerId: 2,
    playerName: 'Marcus Johnson',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-06-12',
    focus: 'Ball handling under pressure',
    rating: 7,
    notes: 'Good control and decision making when pressured. Needs to be more confident with off-hand dribbling. Body positioning could be improved to shield the ball better against aggressive defenders.',
    actionItems: ['Off-hand dribbling drills', 'Pressure situation training']
  },
  {
    id: 11,
    playerId: 2,
    playerName: 'Marcus Johnson',
    coachId: 3,
    coachName: 'Coach Wilson',
    date: '2024-06-05',
    focus: 'Defensive positioning',
    rating: 6,
    notes: 'Sometimes caught out of position in transition defense. Needs to work on defensive awareness and quicker recovery after offensive possessions. Good stance and footwork when in position, but struggles with closeouts on shooters.',
    actionItems: ['Defensive rotation drills', 'Transition defense video analysis']
  },
  {
    id: 12,
    playerId: 2,
    playerName: 'Marcus Johnson',
    coachId: 2,
    coachName: 'Coach Rodriguez',
    date: '2024-05-29',
    focus: 'Spot-up shooting',
    rating: 9,
    notes: 'Outstanding catch-and-shoot performances. Created 4 clear scoring opportunities from spot-up situations. Technique is excellent and decision making about when to shoot or drive was perfect.',
    actionItems: ['Continue practicing varied shot situations', 'Work on quick release off the catch']
  },
  {
    id: 13,
    playerId: 2,
    playerName: 'Marcus Johnson',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-05-22',
    focus: 'On-court Communication',
    rating: 7,
    notes: 'Growing as a vocal leader on defense. Regularly calling out screens and helping with defensive rotations. Still needs to be more assertive in critical possessions and late-game situations.',
    actionItems: ['Leadership exercises', 'Defensive communication drills in practice']
  },
  {
    id: 14,
    playerId: 2,
    playerName: 'Marcus Johnson',
    coachId: 3,
    coachName: 'Coach Wilson',
    date: '2024-05-15',
    focus: 'Three-point shot selection',
    rating: 6,
    notes: 'Technique is good but decision making needs improvement. Taking too many contested three-pointers early in shot clock. Needs to focus on when to shoot vs. when to move the ball for better team offense.',
    actionItems: ['Shot selection training', 'Decision making exercises in offensive sets']
  },
  {
    id: 15,
    playerId: 2,
    playerName: 'Marcus Johnson',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-05-08',
    focus: 'Ball handling',
    rating: 8,
    notes: 'Excellent dribbling control in tight spaces. Consistently maintained possession under pressure and created scoring opportunities. Very few turnovers throughout the scrimmage, showing good decision making with the ball.',
    actionItems: ['Continue ball handling drills', 'Work on quick decision making after beating defenders']
  },
  {
    id: 16,
    playerId: 2,
    playerName: 'Marcus Johnson',
    coachId: 2,
    coachName: 'Coach Rodriguez',
    date: '2024-05-01',
    focus: 'Conditioning and stamina',
    rating: 7,
    notes: 'Good endurance throughout full-court scrimmages. Maintained energy levels even in the fourth quarter. Could improve offensive positioning to reduce unnecessary movement and be more efficient on the floor.',
    actionItems: ['Court positioning drills', 'Continue high-intensity interval training']
  },

  // Deandre Thomas Observations
  {
    id: 17,
    playerId: 3,
    playerName: 'Deandre Thomas',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-06-13',
    focus: 'Defensive positioning',
    rating: 9,
    notes: 'Excellent leadership in the frontcourt defense. Constantly communicating and adjusting positions based on offensive threats. Organized help defense effectively resulting in several steals and stops.',
    actionItems: ['Continue defensive leadership role', 'Work on defensive rotation anticipation']
  },
  {
    id: 18,
    playerId: 3,
    playerName: 'Deandre Thomas',
    coachId: 2,
    coachName: 'Coach Rodriguez',
    date: '2024-06-08',
    focus: 'Rebounding technique',
    rating: 8,
    notes: 'Dominant on the boards, securing approximately 80% of contested rebounds in his area. Good judgment on when to attack the ball vs. when to box out. Technique is excellent on defensive rebounds and outlet passes.',
    actionItems: ['Practice offensive rebounding positioning', 'Timing jumps against different opponent types']
  },
  {
    id: 19,
    playerId: 3,
    playerName: 'Deandre Thomas',
    coachId: 3,
    coachName: 'Coach Wilson',
    date: '2024-06-02',
    focus: 'Post moves',
    rating: 7,
    notes: 'Good footwork and comfortable with back to the basket. Occasionally rushes shots when double-teamed. Needs to focus on reading the defense and making better pass decisions when under pressure.',
    actionItems: ['Decision making under pressure', 'Post pass-out options']
  },
  {
    id: 20,
    playerId: 3,
    playerName: 'Deandre Thomas',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-05-25',
    focus: 'One-on-one post defense',
    rating: 8,
    notes: 'Strong in defensive matchups in the post. Good body positioning and patience. Rarely falls for pump fakes and forces offensive players into difficult shots. Recovery ability is excellent when initially beaten.',
    actionItems: ['Continue work on defensive stance', 'Practice against different post player types']
  },
  {
    id: 21,
    playerId: 3,
    playerName: 'Deandre Thomas',
    coachId: 2,
    coachName: 'Coach Rodriguez',
    date: '2024-05-18',
    focus: 'Transition defense',
    rating: 7,
    notes: 'Good recovery speed in transition defense. Positioning could be better to reduce need for chase-down contests. Needs to improve recognition of fast break situations earlier.',
    actionItems: ['Video analysis of transition moments', 'Defensive positioning drills']
  },
  {
    id: 22,
    playerId: 3,
    playerName: 'Deandre Thomas',
    coachId: 3,
    coachName: 'Coach Wilson',
    date: '2024-05-11',
    focus: 'Screen setting',
    rating: 9,
    notes: 'Excellent at organizing offensive sets. Takes responsibility for calling out plays and communication. Strong in setting screens and good at creating space for shooters.',
    actionItems: ['Continue leadership role in offensive sets', 'Practice different screen angles and timing']
  },
  {
    id: 23,
    playerId: 3,
    playerName: 'Deandre Thomas',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-05-04',
    focus: 'Handling double teams',
    rating: 6,
    notes: 'Sometimes panics under double team pressure. Needs to remain calmer and look for simple passing options. Technical ability is there but decision making can improve when opponents trap in the post.',
    actionItems: ['Post play under pressure drills', 'Simple pass-out options practice']
  },
  {
    id: 24,
    playerId: 3,
    playerName: 'Deandre Thomas',
    coachId: 2,
    coachName: 'Coach Rodriguez',
    date: '2024-04-27',
    focus: 'Reading the game',
    rating: 8,
    notes: 'Excellent anticipation of offensive plays. Intercepted passes multiple times and positioned himself well defensively. Very intelligent player on both ends of the court.',
    actionItems: ['Continue video analysis work', 'Decision making exercises in scrimmages']
  },

  // Michael Chen Observations
  {
    id: 25,
    playerId: 4,
    playerName: 'Michael Chen',
    coachId: 2,
    coachName: 'Coach Rodriguez',
    date: '2024-06-12',
    focus: 'Post defense',
    rating: 9,
    notes: 'Outstanding positioning on post defense. Made 5 critical stops in the scrimmage. Positioning was excellent throughout and command of the paint continues to improve.',
    actionItems: ['Continue varied defensive positioning drills', 'Work on recovery position after help defense']
  },
  {
    id: 26,
    playerId: 4,
    playerName: 'Michael Chen',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-06-11',
    focus: 'Passing from the post',
    rating: 7,
    notes: 'Generally accurate with interior and short passes. Outlet passes need work on accuracy. Decision making was good and quick to release for fast breaks.',
    actionItems: ['Long outlet pass practice', 'Quick decision making drills under pressure']
  },
  {
    id: 27,
    playerId: 4,
    playerName: 'Michael Chen',
    coachId: 2,
    coachName: 'Coach Rodriguez',
    date: '2024-06-04',
    focus: 'Command of the paint',
    rating: 8,
    notes: 'Very vocal and decisive on defense. Protected the rim on several occasions confidently. Occasionally hesitant on help rotations at the elbow area - needs clearer decision making.',
    actionItems: ['Practice help defense at varying positions', 'Communication drills with teammates']
  },
  {
    id: 28,
    playerId: 4,
    playerName: 'Michael Chen',
    coachId: 3,
    coachName: 'Coach Wilson',
    date: '2024-05-28',
    focus: 'Rebounding positioning',
    rating: 9,
    notes: 'Excellent positioning reduced need for spectacular efforts. Consistently in the right place at the right time. Box-out technique was perfect throughout the scrimmage.',
    actionItems: ['Continue positional awareness drills', 'Work on quick adjustments for long rebounds']
  },
  {
    id: 29,
    playerId: 4,
    playerName: 'Michael Chen',
    coachId: 2,
    coachName: 'Coach Rodriguez',
    date: '2024-05-21',
    focus: 'One-on-one post defense',
    rating: 7,
    notes: 'Good patience in one-on-ones. Maintains good position and makes himself big. Timing of contests could be better - occasionally jumps too early giving shooters an advantage.',
    actionItems: ['One-on-one post defense practice with varied offensive players', 'Work on patience and timing']
  },
  {
    id: 30,
    playerId: 4,
    playerName: 'Michael Chen',
    coachId: 1,
    coachName: 'Coach Johnson',
    date: '2024-05-14',
    focus: 'Perimeter defense role',
    rating: 6,
    notes: 'Still developing comfort level outside the paint. Decision making needs improvement on when to close out vs. when to protect the paint. Technique is good when he does commit to perimeter defense.',
    actionItems: ['Practice scenarios requiring perimeter rotations', 'Decision making drills with guards']
  },
  {
    id: 31,
    playerId: 4,
    playerName: 'Michael Chen',
    coachId: 2,
    coachName: 'Coach Rodriguez',
    date: '2024-05-07',
    focus: 'Post moves technique',
    rating: 8,
    notes: 'Very secure footwork on most post moves. Only one turnover during the entire scrimmage which was recovered well. Drop step technique on strong side is excellent - always creating space for clean shots.',
    actionItems: ['Continue work on footwork drills', 'Practice finishing moves to both sides']
  },
  {
    id: 32,
    playerId: 4,
    playerName: 'Michael Chen',
    coachId: 3,
    coachName: 'Coach Wilson',
    date: '2024-04-30',
    focus: 'Team defense organization',
    rating: 7,
    notes: 'Good communication organizing defensive rotations. Takes charge of the paint well. Could be more assertive with more experienced teammates who sometimes override his instructions.',
    actionItems: ['Leadership exercises', 'Clear communication patterns practice']
  }
];

// Mock PDPs Data
export const mockPDPs = [
  {
    id: 1,
    playerId: 1,
    playerName: 'Jayden Williams',
    title: 'Point Guard Development Plan',
    startDate: '2024-05-01',
    endDate: '2024-08-01',
    status: 'In Progress',
    progress: 65,
    goals: [
      { area: 'Three-Point Shooting', target: 'Improve three-point percentage to 38%', progress: 70 },
      { area: 'Court Vision', target: 'Better assist-to-turnover ratio', progress: 60 },
      { area: 'Quickness', target: 'Increase first step speed by 5%', progress: 65 }
    ]
  },
  {
    id: 2,
    playerId: 2,
    playerName: 'Marcus Johnson',
    title: 'Shooting Guard Development',
    startDate: '2024-04-15',
    endDate: '2024-07-15',
    status: 'Review Due',
    progress: 80,
    goals: [
      { area: 'Off-ball Movement', target: 'Increase catch-and-shoot efficiency to 85%', progress: 90 },
      { area: 'Perimeter Defense', target: 'Improve closeout technique and containment', progress: 75 },
      { area: 'Leadership', target: 'Vocal leader on defensive assignments', progress: 75 }
    ]
  }
];

// Mock PDP History Data
export const mockPDPHistory = [
  {
    id: 101,
    playerId: 1,
    playerName: 'Jayden Williams',
    title: 'Basic Guard Skills',
    startDate: '2024-01-10',
    endDate: '2024-04-30',
    status: 'Archived',
    progress: 100,
    goals: [
      { area: 'Shooting', target: 'Master mid-range shooting techniques', progress: 100 },
      { area: 'Ball Handling', target: 'Develop advanced dribble moves', progress: 95 }
    ]
  },
  {
    id: 102,
    playerId: 1,
    playerName: 'Jayden Williams',
    title: 'Speed Development',
    startDate: '2023-09-15',
    endDate: '2023-12-20',
    status: 'Archived',
    progress: 90,
    goals: [
      { area: 'Acceleration', target: 'Reduce baseline-to-baseline time by 0.3s', progress: 85 },
      { area: 'Lateral Quickness', target: 'Improve defensive slide speed', progress: 95 }
    ]
  },
  {
    id: 201,
    playerId: 2,
    playerName: 'Marcus Johnson',
    title: 'Shooting Fundamentals',
    startDate: '2023-11-01',
    endDate: '2024-04-10',
    status: 'Archived',
    progress: 100,
    goals: [
      { area: 'Shot Form', target: 'Improve consistency in mechanics', progress: 100 },
      { area: 'Free Throws', target: 'Reach 85% free throw percentage', progress: 90 }
    ]
  }
];