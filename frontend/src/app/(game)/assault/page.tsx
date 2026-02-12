'use client';

import { Swords, Search, ScrollText, Shield, Zap, Star, Clock, Skull, Trophy } from 'lucide-react';

const mockTargets = [
  { name: 'DarkReaper42', level: 12, respect: 3400, status: 'Online', risk: 'Medium' },
  { name: 'StreetKing99', level: 8, respect: 1200, status: 'Online', risk: 'Low' },
  { name: 'ShadowViper', level: 18, respect: 8900, status: 'Idle', risk: 'High' },
  { name: 'CrimeLord_X', level: 15, respect: 5600, status: 'Online', risk: 'Medium' },
];

const combatLog = [
  { attacker: 'You', defender: 'NoobSlayer', result: 'Victory', moneyStolen: 450, time: '2 min ago' },
  { attacker: 'GhostBlade', defender: 'You', result: 'Defeat', moneyStolen: 230, time: '15 min ago' },
  { attacker: 'You', defender: 'StreetRat', result: 'Victory', moneyStolen: 780, time: '1 hour ago' },
  { attacker: 'NightCrawler', defender: 'You', result: 'Defeat', moneyStolen: 120, time: '3 hours ago' },
];

export default function AssaultPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Swords className="w-7 h-7 text-crims-primary" />
        <h1 className="text-3xl font-bold font-crime tracking-wider">ASSAULT</h1>
      </div>

      {/* Description */}
      <div className="crims-card mb-6 bg-crims-primary/5 border-crims-primary/20">
        <p className="text-sm text-crims-text-dim">
          Attack other players to steal their cash and earn respect. Choose your targets wisely --
          stronger opponents yield bigger rewards but carry greater risk. Equip better weapons and
          armor to increase your combat effectiveness. Watch out for retaliation.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="crims-card text-center">
          <Swords className="w-5 h-5 mx-auto mb-1 text-crims-primary" />
          <p className="text-xs text-crims-muted">Attack</p>
          <p className="text-lg font-bold">--</p>
        </div>
        <div className="crims-card text-center">
          <Shield className="w-5 h-5 mx-auto mb-1 text-crims-secondary" />
          <p className="text-xs text-crims-muted">Defense</p>
          <p className="text-lg font-bold">--</p>
        </div>
        <div className="crims-card text-center">
          <Trophy className="w-5 h-5 mx-auto mb-1 text-crims-neon" />
          <p className="text-xs text-crims-muted">Win Rate</p>
          <p className="text-lg font-bold">--%</p>
        </div>
        <div className="crims-card text-center">
          <Zap className="w-5 h-5 mx-auto mb-1 text-crims-accent" />
          <p className="text-xs text-crims-muted">Stamina Cost</p>
          <p className="text-lg font-bold">15</p>
        </div>
      </div>

      {/* Find Targets */}
      <div className="mb-8">
        <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider flex items-center gap-2">
          <Search className="w-5 h-5" /> Find Targets
        </h2>
        <div className="crims-card">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Search player by name..."
              className="crims-input flex-1"
              disabled
            />
            <button className="crims-btn-primary text-xs px-4 opacity-50 cursor-not-allowed">
              SEARCH
            </button>
          </div>
          <div className="space-y-2">
            {mockTargets.map((target) => (
              <div key={target.name} className="flex items-center justify-between p-3 rounded-lg border border-crims-border hover:border-crims-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-crims-primary/20 flex items-center justify-center">
                    <Skull className="w-4 h-4 text-crims-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{target.name}</p>
                    <p className="text-xs text-crims-muted">Level {target.level} | {target.respect} respect</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    target.status === 'Online' ? 'bg-crims-neon/10 text-crims-neon' : 'bg-crims-accent/10 text-crims-accent'
                  }`}>
                    {target.status}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    target.risk === 'Low' ? 'bg-crims-neon/10 text-crims-neon' :
                    target.risk === 'Medium' ? 'bg-crims-accent/10 text-crims-accent' :
                    'bg-crims-danger/10 text-crims-danger'
                  }`}>
                    {target.risk} Risk
                  </span>
                  <button className="crims-btn-primary text-xs py-1.5 px-3 opacity-50 cursor-not-allowed">
                    ATTACK
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Combat Log */}
      <div>
        <h2 className="text-lg font-crime font-semibold text-crims-text-dim mb-3 uppercase tracking-wider flex items-center gap-2">
          <ScrollText className="w-5 h-5" /> Combat Log
        </h2>
        <div className="crims-card">
          <div className="space-y-3">
            {combatLog.map((entry, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                entry.result === 'Victory' ? 'border-l-crims-neon bg-crims-neon/5' : 'border-l-crims-danger bg-crims-danger/5'
              }`}>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{entry.attacker}</span>
                    <span className="text-crims-muted mx-2">vs</span>
                    <span className="font-semibold">{entry.defender}</span>
                  </p>
                  <p className={`text-xs mt-0.5 ${entry.result === 'Victory' ? 'text-crims-neon' : 'text-crims-danger'}`}>
                    {entry.result} -- ${entry.moneyStolen} {entry.result === 'Victory' ? 'stolen' : 'lost'}
                  </p>
                </div>
                <span className="text-xs text-crims-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {entry.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
