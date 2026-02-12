'use client';

import { GraduationCap, BookOpen, Lock, CheckCircle, Clock, Star, Zap, ChevronRight } from 'lucide-react';

const skillTrees = [
  {
    name: 'Street Smarts',
    description: 'Improve your robbery success and evasion skills.',
    color: 'text-crims-primary',
    bgColor: 'bg-crims-primary/10',
    skills: [
      { name: 'Pickpocketing', level: 'Max', status: 'completed' },
      { name: 'Lockpicking', level: '3/5', status: 'available' },
      { name: 'Getaway Driving', level: '0/5', status: 'locked' },
      { name: 'Disguise', level: '0/3', status: 'locked' },
    ],
  },
  {
    name: 'Combat Training',
    description: 'Boost your attack and defense in PvP assaults.',
    color: 'text-crims-danger',
    bgColor: 'bg-crims-danger/10',
    skills: [
      { name: 'Brawling', level: '2/5', status: 'available' },
      { name: 'Weapon Mastery', level: '0/5', status: 'locked' },
      { name: 'Armor Expertise', level: '0/5', status: 'locked' },
      { name: 'Critical Strike', level: '0/3', status: 'locked' },
    ],
  },
  {
    name: 'Chemistry',
    description: 'Unlock drug production recipes and improve yields.',
    color: 'text-crims-neon',
    bgColor: 'bg-crims-neon/10',
    skills: [
      { name: 'Basic Botany', level: '1/3', status: 'available' },
      { name: 'Organic Chemistry', level: '0/5', status: 'locked' },
      { name: 'Lab Management', level: '0/5', status: 'locked' },
      { name: 'Synthesis Mastery', level: '0/3', status: 'locked' },
    ],
  },
  {
    name: 'Business',
    description: 'Earn more from trading and reduce marketplace fees.',
    color: 'text-crims-secondary',
    bgColor: 'bg-crims-secondary/10',
    skills: [
      { name: 'Negotiation', level: '0/5', status: 'available' },
      { name: 'Money Laundering', level: '0/5', status: 'locked' },
      { name: 'Market Analysis', level: '0/3', status: 'locked' },
      { name: 'Empire Management', level: '0/1', status: 'locked' },
    ],
  },
];

const professions = [
  { name: 'Thief', requirement: 'Street Smarts Level 10', bonus: '+25% Robbery Rewards' },
  { name: 'Enforcer', requirement: 'Combat Training Level 10', bonus: '+25% PvP Damage' },
  { name: 'Chemist', requirement: 'Chemistry Level 10', bonus: '+25% Drug Production' },
  { name: 'Kingpin', requirement: 'All Trees Level 5', bonus: '+10% All Income' },
];

export default function UniversityPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <GraduationCap className="w-7 h-7 text-crims-primary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">UNIVERSITY</h1>
      </div>

      {/* Description */}
      <div className="crims-card mb-6 bg-crims-primary/5 border-crims-primary/20">
        <p className="text-sm text-crims-text-dim">
          Invest time and money to learn new skills and advance your criminal profession.
          Each skill tree unlocks powerful bonuses and opens new gameplay possibilities.
          Master all trees to become a true Kingpin of the underworld.
        </p>
      </div>

      {/* Current Progress */}
      <div className="crims-card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-crime font-semibold uppercase tracking-wider text-sm text-crims-muted">Your Progress</h3>
          <span className="text-xs text-crims-muted">Total Skill Points: <span className="text-crims-accent font-bold">0</span></span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg border border-crims-border">
            <BookOpen className="w-5 h-5 mx-auto mb-1 text-crims-primary" />
            <p className="text-xs text-crims-muted">Courses Completed</p>
            <p className="text-lg font-bold">1</p>
          </div>
          <div className="text-center p-3 rounded-lg border border-crims-border">
            <Star className="w-5 h-5 mx-auto mb-1 text-crims-accent" />
            <p className="text-xs text-crims-muted">Total Skills</p>
            <p className="text-lg font-bold">3/16</p>
          </div>
          <div className="text-center p-3 rounded-lg border border-crims-border">
            <Clock className="w-5 h-5 mx-auto mb-1 text-crims-secondary" />
            <p className="text-xs text-crims-muted">Currently Studying</p>
            <p className="text-lg font-bold text-crims-muted">None</p>
          </div>
          <div className="text-center p-3 rounded-lg border border-crims-border">
            <GraduationCap className="w-5 h-5 mx-auto mb-1 text-crims-neon" />
            <p className="text-xs text-crims-muted">Profession</p>
            <p className="text-lg font-bold text-crims-muted">None</p>
          </div>
        </div>
      </div>

      {/* Skill Trees */}
      <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider">Skill Trees</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {skillTrees.map((tree) => (
          <div key={tree.name} className="crims-card hover:border-crims-primary/30 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-lg ${tree.bgColor} flex items-center justify-center`}>
                <BookOpen className={`w-4 h-4 ${tree.color}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${tree.color}`}>{tree.name}</h3>
                <p className="text-xs text-crims-muted">{tree.description}</p>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              {tree.skills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between p-2 rounded border border-crims-border">
                  <div className="flex items-center gap-2">
                    {skill.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-crims-neon" />
                    ) : skill.status === 'available' ? (
                      <Zap className="w-4 h-4 text-crims-accent" />
                    ) : (
                      <Lock className="w-4 h-4 text-crims-muted" />
                    )}
                    <span className={`text-sm ${skill.status === 'locked' ? 'text-crims-muted' : ''}`}>
                      {skill.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${
                      skill.status === 'completed' ? 'text-crims-neon' :
                      skill.status === 'available' ? 'text-crims-accent' :
                      'text-crims-muted'
                    }`}>
                      {skill.level}
                    </span>
                    {skill.status === 'available' && (
                      <ChevronRight className="w-3 h-3 text-crims-accent" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Professions */}
      <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider">Professions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {professions.map((prof) => (
          <div key={prof.name} className="crims-card opacity-60">
            <h3 className="font-semibold font-crime text-center mb-2">{prof.name}</h3>
            <p className="text-xs text-crims-muted text-center mb-2">{prof.requirement}</p>
            <div className="text-center text-xs text-crims-neon bg-crims-neon/5 rounded py-1">
              {prof.bonus}
            </div>
            <div className="text-center mt-3">
              <Lock className="w-4 h-4 mx-auto text-crims-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
