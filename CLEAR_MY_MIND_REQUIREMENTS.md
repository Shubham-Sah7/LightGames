# Clear My Mind - Requirements Specification

## 🎯 Vision

Create a premium, multi-screen mindfulness experience where users clear mental clutter by tapping realistic rain droplets on glass. This is a complete user journey with welcome, introduction, interaction, and completion screens - designed to feel like a standalone wellness app experience.

---

## 🌊 Complete User Journey

### Screen 1: Welcome Screen
**Purpose**: Set the tone and invite the user in

**Layout**:
- Centered content
- Honeydew background with subtle organic shapes
- Minimal, spacious design

**Content**:
- **Heading**: "Clear My Mind"
  - Deep Ocean color (#083F56)
  - 32px font size
  - Font weight: 500
  - Letter spacing: -0.02em
  - Centered
  
- **Subtext**: 
  ```
  Feeling overwhelmed, distracted, or carrying too much in your head?
  
  Take a moment to slow down. Watch your thoughts turn into rain and gently clear them away.
  ```
  - Lavender Fog color (#76648B)
  - 16px font size
  - Font weight: 400
  - Line height: 1.5
  - Centered
  - Max width: 320px
  - Opacity: 85%
  
- **CTA Button**: "Start Clearing"
  - Lavender Fog background (#76648B)
  - White text
  - 58px height
  - 16px border radius
  - Full width (max 340px)
  - 16px font size
  - Font weight: 500

**Animation**:
- Fade in on load (0.8s)
- Subtle breathing animation on background shapes

---

### Screen 2: Introduction Screen
**Purpose**: Explain the experience without overwhelming

**Layout**:
- Centered content
- Same background as welcome
- More text-focused

**Content**:
- **Heading**: "A Few Quiet Moments For Yourself"
  - Deep Ocean color
  - 26px font size
  - Font weight: 500
  - Centered
  - Margin bottom: 24px
  
- **Message** (3 paragraphs):
  ```
  Every raindrop represents a thought, worry, or mental clutter.
  
  Tap the drops one by one and watch them wash away.
  
  There is no score. There is no timer. Just a small moment to clear your mind.
  ```
  - Lavender Fog color
  - 15px font size
  - Line height: 1.6
  - Centered
  - Max width: 300px
  - Paragraph spacing: 16px
  
- **CTA Button**: "Begin"
  - Same style as welcome screen
  - Positioned at bottom

**Animation**:
- Fade in with slight upward movement
- Each paragraph fades in sequentially (0.3s delay between)

---

### Screen 3: Rain Clearing Experience
**Purpose**: The core interactive experience

#### Visual Experience

**Glass Effect**:
- Subtle texture overlay
- Very light blur on background
- Realistic glass material feel
- No heavy effects (performance)

**Rain Droplets**:
- **Count**: 40-60 droplets
- **Size**: 4-12px radius (varied)
- **Color**: Calm Teal (#57A99A) with transparency
- **Behavior**:
  - Slowly slide down naturally (gravity)
  - Small drops merge into larger drops when they touch
  - Realistic physics (acceleration, friction)
  - Different speeds based on size
  - Leave subtle trails as they slide

**Background**:
- Blurred calming scenery
- Honeydew base with Sage Mist shapes
- Soft, out-of-focus organic forms
- Subtle movement (parallax on tilt - optional)

**Ambient Elements**:
- Soft rain sound (optional, toggle)
- Very subtle rain particles in background
- Gentle fog/mist effect at edges

#### Interaction Design

**Tap to Clear**:
- User taps individual droplets
- Each cleared droplet:
  1. **Ripple Effect** (0.4s)
     - Circular ripple expands from tap point
     - Calm Teal color with fade
     - 2-3 concentric rings
     - Easing: ease-out
     
  2. **Fade Away** (0.5s)
     - Droplet shrinks and fades
     - Slight upward float (5-10px)
     - Easing: ease-in-out
     
  3. **Particle Release** (0.8s)
     - 5-8 tiny glowing particles
     - Warm Sunset (#F59A4A) color
     - Drift upward and outward
     - Fade out gradually
     - Size: 2-3px

**Tap Feedback**:
- Haptic feedback on mobile (light tap)
- Smooth, responsive (no lag)
- Visual confirmation immediate

#### Supportive Messages

**Message System**:
- Messages appear periodically (every 8-12 droplets cleared)
- Fade in at center-top of screen
- Hold for 2 seconds
- Fade out
- Never overlap with droplets

**Message List**:
- "Let it pass."
- "You don't need to carry everything."
- "One thought at a time."
- "You're doing well."
- "Not everything needs an answer today."
- "This moment is yours."
- "Breathe."
- "It's okay to let go."

**Message Styling**:
- Lavender Fog color
- 18px font size
- Font weight: 400
- Centered
- Subtle glow/shadow for readability
- Opacity: 90%

#### Progressive Clearing

**As droplets are cleared**:
- **Rain Intensity**: Gradually decreases
  - Fewer new droplets spawn
  - Slower falling speed
  - Lighter colors
  
- **Screen Clarity**: Increases
  - Glass becomes clearer
  - Background becomes more visible
  - Fog/mist fades away
  
- **Sunlight Appearance**: 
  - Soft golden light begins appearing (Warm Sunset tint)
  - Light rays through glass (subtle)
  - Warm glow at edges
  - Gradual transition (not sudden)

**Final Droplet**:
- When last droplet is cleared:
  - Rain stops completely
  - Glass becomes crystal clear
  - Sunlight fills the screen
  - 2-3 second peaceful hold
  - Automatic transition to completion

---

### Screen 4: Completion Moment
**Purpose**: Peaceful transition and acknowledgment

**Visual**:
- Full-screen sunlight animation
- Warm Sunset gradient (subtle)
- Honeydew background
- Gentle light rays
- Soft particles floating upward

**Message**:
```
Your mind feels a little lighter now.

Thank you for taking a moment for yourself.
```
- Deep Ocean color
- 22px font size
- Centered
- Line height: 1.5
- Fade in over 1 second

**Duration**: 3-4 seconds
**Transition**: Fade to reward screen

---

### Screen 5: Reward Screen
**Purpose**: Provide closure and encourage return

**Layout**:
- Centered content
- Honeydew background
- Card-based design

**Content**:

1. **Heading**: "Mind Cleared"
   - Deep Ocean color
   - 28px font size
   - Font weight: 500
   - Centered
   - Margin bottom: 32px

2. **Stats Card**:
   - White background (70% opacity)
   - Sage Mist border
   - 16px border radius
   - 24px padding
   - Centered
   - Max width: 320px
   
   **Stats**:
   - **Thoughts Released**: [count] droplets cleared
   - **Time Spent Relaxing**: [duration] (e.g., "2 min 34 sec")
   - **Calmness Streak**: [days] days in a row
   
   **Stat Styling**:
   - Label: Lavender Fog, 13px, opacity 70%
   - Value: Deep Ocean, 24px, font weight 500
   - Icon: Small emoji or Lavender Fog icon
   - Spacing: 20px between stats

3. **Message**:
   ```
   Even a few quiet moments can make a difference.
   ```
   - Lavender Fog color
   - 15px font size
   - Centered
   - Margin: 24px top/bottom
   - Opacity: 85%

4. **Quote**:
   ```
   "A calm mind is not the absence of thoughts, 
   but the ability to let them pass."
   ```
   - Deep Ocean color
   - 14px font size
   - Italic
   - Centered
   - Max width: 280px
   - Opacity: 70%
   - Margin bottom: 32px

5. **CTA Button**: "Continue"
   - Lavender Fog background
   - White text
   - 58px height
   - Full width (max 340px)
   - Returns to Games Hub

**Animation**:
- Stats count up from 0 (satisfying)
- Fade in sequentially
- Subtle celebration particles (optional)

---

## 🎨 Visual Design System

### Color Palette (Zumlo Brand Only)
- **Background**: Honeydew (#F0FFF0)
- **Glass/Droplets**: Calm Teal (#57A99A)
- **Text Primary**: Deep Ocean (#083F56)
- **Text Secondary**: Lavender Fog (#76648B)
- **Accents**: Warm Sunset (#F59A4A)
- **Borders/Subtle**: Sage Mist (#B8CBBE)

### Typography
- **Headings**: -apple-system, system-ui, sans-serif
- **Body**: -apple-system, system-ui, sans-serif
- **Weights**: 400 (regular), 500 (medium)
- **Line Heights**: 1.3 (headings), 1.5-1.6 (body)

### Spacing System
- **Small**: 8px, 12px, 16px
- **Medium**: 20px, 24px, 32px
- **Large**: 40px, 48px, 64px

### Border Radius
- **Buttons/Cards**: 16px
- **Small elements**: 12px

---

## 🎬 Animation Specifications

### Screen Transitions
- **Duration**: 0.5-0.8s
- **Easing**: ease-in-out
- **Type**: Fade + slight movement (10-20px)

### Droplet Physics
- **Gravity**: 0.15-0.3 px/frame (varies by size)
- **Merge Distance**: 8-12px
- **Slide Speed**: Larger drops = faster
- **Trail Length**: 10-20px

### Tap Interactions
- **Response Time**: < 50ms
- **Ripple Duration**: 0.4s
- **Fade Duration**: 0.5s
- **Particle Duration**: 0.8s

### Sunlight Transition
- **Duration**: 2-3 seconds
- **Easing**: ease-out
- **Opacity**: 0 → 100%
- **Color**: Honeydew → Warm Sunset tint

---

## 💾 Data Persistence

### Session Data (Track during experience)
```typescript
interface ClearMindSession {
  startTime: Date
  endTime: Date
  dropletsCleared: number
  duration: number // seconds
  completed: boolean
}
```

### User Stats (Database)
```prisma
model ClearMindStats {
  id              String   @id @default(cuid())
  userId          String   // Clerk user ID
  totalSessions   Int      @default(0)
  totalDroplets   Int      @default(0)
  totalMinutes    Int      @default(0)
  currentStreak   Int      @default(0)
  longestStreak   Int      @default(0)
  lastSessionDate DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId])
  @@index([userId])
}

model ClearMindSession {
  id              String   @id @default(cuid())
  userId          String
  dropletsCleared Int
  durationSeconds Int
  completedAt     DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([completedAt])
}
```

### Streak Logic
- **Streak increments**: If session completed today and yesterday had session
- **Streak resets**: If more than 1 day gap
- **Timezone**: Use user's local timezone

---

## 🎮 User Flow & Navigation

### Entry Points
1. From Games Hub → "Clear My Mind" card
2. Direct link (if shared)

### Navigation Flow
```
Games Hub
  ↓
Welcome Screen (Screen 1)
  ↓ [Start Clearing]
Introduction Screen (Screen 2)
  ↓ [Begin]
Rain Clearing Experience (Screen 3)
  ↓ [Auto: All droplets cleared]
Completion Moment (Screen 4)
  ↓ [Auto: After 3-4 seconds]
Reward Screen (Screen 5)
  ↓ [Continue]
Games Hub
```

### Exit Points
- Back button: Returns to Games Hub (with confirmation if mid-experience)
- Continue button: Returns to Games Hub
- No forced completion (can exit anytime)

---

## ⚡ Performance Requirements

### Target Performance
- **Frame Rate**: 60 FPS (smooth animations)
- **Load Time**: < 2 seconds per screen
- **Interaction Response**: < 50ms
- **Memory**: < 100MB

### Optimization Strategies
- **Canvas Rendering**: Use requestAnimationFrame
- **Particle Limit**: Max 50 particles at once
- **Droplet Limit**: Max 60 droplets at once
- **Image Optimization**: Use CSS for backgrounds (no heavy images)
- **Audio**: Lazy load, optional, small file size

### Mobile Considerations
- **Touch Targets**: Min 44x44px
- **Haptic Feedback**: Light, not overwhelming
- **Battery**: Efficient animations
- **Orientation**: Portrait only (lock)

---

## 🎵 Audio Design (Optional)

### Sound Effects
- **Rain Ambience**: Soft, looping, 30-60 seconds
- **Tap Sound**: Gentle water drop (subtle)
- **Completion**: Soft chime or bell

### Audio Controls
- **Toggle**: On/off button (top-right corner)
- **Volume**: Respect system volume
- **Default**: Off (user must enable)
- **Persistence**: Remember user preference

### Audio Files
- **Format**: MP3 or WebM
- **Size**: < 500KB total
- **Quality**: Compressed but clear

---

## 🚫 What NOT to Do

### Visual
- ❌ No gaming UI (scores, timers, progress bars)
- ❌ No dark mode
- ❌ No heavy 3D effects
- ❌ No distracting animations
- ❌ No bright/neon colors
- ❌ No cluttered screens

### Interaction
- ❌ No forced speed (user's pace)
- ❌ No penalties for slow clearing
- ❌ No competitive elements
- ❌ No social comparison
- ❌ No ads or interruptions

### Technical
- ❌ No heavy libraries (keep it light)
- ❌ No external dependencies for core experience
- ❌ No tracking beyond necessary stats
- ❌ No auto-play audio

---

## 🎯 Success Criteria

### User Experience
- [ ] Feels calming and peaceful
- [ ] Interactions are smooth and responsive
- [ ] Messages feel supportive, not preachy
- [ ] Progression feels natural
- [ ] Completion feels rewarding
- [ ] Users want to return

### Visual Quality
- [ ] Droplets look realistic
- [ ] Glass effect is subtle and premium
- [ ] Animations are smooth (60 FPS)
- [ ] Colors match Zumlo brand exactly
- [ ] Typography is clear and readable

### Technical
- [ ] No lag or stuttering
- [ ] Works on mobile (iPhone frame)
- [ ] Data persists correctly
- [ ] Streak logic works
- [ ] Build passes without errors
- [ ] TypeScript types are correct

### Emotional Impact
- [ ] Users feel lighter after completion
- [ ] Experience is memorable
- [ ] Not stressful or frustrating
- [ ] Encourages mindfulness
- [ ] Feels like a gift, not a task

---

## 📋 Implementation Phases

### Phase 1: Core Experience (MVP)
- Screen 3: Rain clearing interaction
- Basic droplet physics (fall, tap to clear)
- Simple ripple effect
- Particle system
- Completion detection
- Basic stats tracking

### Phase 2: Full Journey
- Screen 1: Welcome screen
- Screen 2: Introduction screen
- Screen 4: Completion moment
- Screen 5: Reward screen
- Navigation flow
- Screen transitions

### Phase 3: Polish & Effects
- Realistic droplet merging
- Glass texture effect
- Sunlight transition
- Supportive messages
- Improved animations
- Haptic feedback

### Phase 4: Data & Persistence
- Database integration
- Streak system
- Session tracking
- Stats calculation
- Historical data

### Phase 5: Premium Details
- Audio (optional)
- Advanced particle effects
- Background scenery
- Performance optimization
- Edge case handling

---

## 🔗 Related Files

### To Create
- **Component**: `/components/clear-my-mind/` (folder)
  - `welcome-screen.tsx`
  - `intro-screen.tsx`
  - `rain-experience.tsx`
  - `completion-moment.tsx`
  - `reward-screen.tsx`
  - `index.tsx` (orchestrator)
- **Page**: `/app/(screens)/clear-my-mind/page.tsx`
- **API**: `/app/api/clear-mind/route.ts`
- **Types**: `/lib/types/clear-mind.ts`

### To Update
- **Database**: `/prisma/schema.prisma`
- **Games Hub**: `/app/(screens)/page.tsx` (add new card)

---

## 📚 Reference Inspiration

- **Calm App**: Multi-screen journeys, peaceful transitions
- **Headspace**: Supportive messaging, gentle guidance
- **Rain Drop Cleanse**: Existing wipe mechanic (but different interaction)
- **Lantern Release**: Completion moment, emotional impact
- **Apple Health**: Stats presentation, streak system

---

## 🔄 Differences from Rain Drop Cleanse

| Aspect | Rain Drop Cleanse | Clear My Mind |
|--------|------------------|---------------|
| **Screens** | Single screen | 5-screen journey |
| **Interaction** | Wipe/drag | Tap individual drops |
| **Droplets** | Static on glass | Falling with physics |
| **Fog** | Wipe away fog | Clear glass |
| **Completion** | Message only | Full reward screen |
| **Data** | None | Stats, streaks, history |
| **Duration** | ~1-2 minutes | ~3-5 minutes |
| **Tone** | Quick release | Guided experience |

---

## ✅ Next Steps

1. **Review and approve requirements**
2. **Create technical design document**
3. **Set up database schema**
4. **Implement Phase 1 (core experience)**
5. **Add full journey (Phase 2)**
6. **Polish and test**
7. **Launch and gather feedback**

---

**Last Updated**: May 29, 2026
**Status**: Requirements Complete - Awaiting Approval
**Estimated Development Time**: 8-12 hours (all phases)
