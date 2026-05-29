# Gratitude Tree - Requirements Specification

## 🎯 Vision

Create a Monument Valley / Apple Design Award quality gratitude experience where users grow a beautiful, organic tree by expressing daily gratitude. The tree should feel alive, magical, and deeply personal - a visual representation of their gratitude journey.

---

## 🌟 Core Experience

### The Moment
When a user expresses gratitude:
1. A seed of light appears at the input area
2. The seed travels upward in a graceful arc toward the tree
3. Upon reaching the tree, it transforms into a new leaf
4. The leaf grows with a gentle animation
5. The tree subtly responds (branch sway, shimmer)
6. The moment feels magical and rewarding

### The Tree
- **Always alive**: Gentle branch sway, leaf movement, wind effects
- **Organic and elegant**: Not flat vector, not cartoon - premium 3D-like quality
- **Grows over time**: Visual progression from sapling to signature tree
- **Personal**: Each leaf represents a unique gratitude moment
- **Peaceful scene**: Soft ground, tiny flowers, birds, floating petals

---

## 📊 Growth System

### Day 1-7: Sapling
- Small trunk (2-3 segments)
- 1-2 thin branches
- 0-7 leaves
- Tiny flowers at base
- Delicate appearance

### Day 8-30: Small Tree
- Medium trunk (4-5 segments)
- 3-5 branches with sub-branches
- 8-30 leaves
- More flowers, grass patches
- Visible growth

### Day 31-100: Flourishing Tree
- Full trunk (6-8 segments)
- 6-10 branches with multiple sub-branches
- 31-100 leaves
- Rich ground scene
- Birds occasionally visit
- Petals float by

### Day 100+: Signature Tree
- Majestic trunk
- Full canopy
- 100+ leaves
- Complete ecosystem (birds, flowers, petals, butterflies)
- Occasional magical moments (sparkles, light rays)
- Peak visual beauty

---

## 🎨 Visual Design

### Color Palette (Zumlo Brand Colors Only)
- **Leaves**: Calm Teal (#57A99A), Sage Mist (#B8CBBE), Warm Sunset (#F59A4A)
- **Trunk/Branches**: Deep Ocean (#083F56) with subtle gradients
- **Ground**: Sage Mist (#B8CBBE) with Honeydew (#F0FFF0) highlights
- **Flowers**: Warm Sunset (#F59A4A), Lavender Fog (#76648B)
- **Background**: Honeydew (#F0FFF0) with subtle organic shapes
- **Particles**: Warm Sunset (#F59A4A), Calm Teal (#57A99A)

### Leaf Design
- **Shape**: Organic, slightly asymmetric
- **Size**: 8-14px (varies by depth and age)
- **Colors**: Randomly assigned from Calm Teal, Sage Mist, Warm Sunset
- **Depth**: Parallax effect (0.7-1.0 scale)
- **Animation**: Gentle sway, occasional flutter
- **Glow**: Subtle when newly created

### Tree Structure
- **Trunk**: Organic curves, not straight lines
- **Branches**: Natural angles (30-60 degrees)
- **Bark texture**: Subtle lines and segments
- **Growth rings**: Visible on trunk
- **Shadow**: Soft, realistic ground shadow

### Scene Elements
- **Ground**: Gentle hill/mound shape
- **Flowers**: 5-15 tiny flowers (increase with growth)
- **Grass**: Subtle texture, not individual blades
- **Birds**: 0-2 birds (appear at Day 30+)
- **Petals**: 3-8 floating petals (appear at Day 50+)
- **Butterflies**: Rare (appear at Day 100+)

---

## 🎬 Animations

### Always-Alive Animations (Continuous)
- **Branch Sway**: Gentle sine wave, different speeds per branch
- **Leaf Movement**: Individual leaf flutter, wind response
- **Wind Effect**: Occasional stronger breeze (every 15-30 seconds)
- **Petal Float**: Slow diagonal drift across screen
- **Bird Movement**: Occasional hop or wing flap
- **Ambient Particles**: Tiny sparkles near tree (very subtle)

### Gratitude Moment Animation (User Action)
1. **Seed Creation** (0.3s)
   - Light appears at input area
   - Grows from 0 to 12px
   - Warm Sunset glow
   
2. **Seed Travel** (1.2s)
   - Bezier curve path to tree
   - Leaves light trail
   - Accelerates slightly
   - Easing: ease-in-out
   
3. **Leaf Birth** (0.8s)
   - Seed transforms into leaf
   - Leaf grows from 0 to full size
   - Gentle rotation (0-15 degrees)
   - Soft glow fades in then out
   
4. **Tree Response** (0.5s)
   - Branches sway slightly more
   - Nearby leaves flutter
   - Subtle shimmer effect
   - Ground flowers bloom slightly

### Growth Stage Transitions (Milestone Animations)
- **Day 7**: New branch grows over 2 seconds
- **Day 30**: Trunk thickens, birds arrive
- **Day 100**: Magical moment (light rays, sparkles, all leaves shimmer)

---

## 📱 Layout & UI

### Screen Division
- **Top 70%**: Tree scene (canvas)
- **Bottom 30%**: Input area

### Tree Scene (Canvas)
- Full width, 70% height
- Tree centered horizontally
- Tree positioned at 60% from top (room for growth)
- Responsive scaling
- Touch-safe (no accidental interactions)

### Input Area
- **Background**: White with subtle transparency
- **Border**: Top border only (Sage Mist)
- **Padding**: 24px horizontal, 20px vertical

### Input Components
1. **Prompt Text**
   - "What are you grateful for today?"
   - Lavender Fog color
   - 18px font size
   - Centered
   - 12px margin bottom

2. **Input Field**
   - 64px height
   - 16px border radius
   - Sage Mist border
   - White background (70% opacity)
   - Deep Ocean text
   - 16px font size
   - Centered text
   - Placeholder: "Type here..."

3. **CTA Button**
   - "Grow My Tree" text
   - Lavender Fog background
   - White text
   - 58px height
   - 16px border radius
   - Full width
   - 16px margin top
   - Disabled state: Sage Mist background, 50% opacity

### Gratitude Counter (Optional)
- Small text above tree: "Day 42 • 42 gratitudes"
- Lavender Fog color, 70% opacity
- 12px font size
- Centered

---

## 💾 Data Persistence

### Database Schema (Prisma)

```prisma
model GratitudeEntry {
  id        String   @id @default(cuid())
  userId    String   // Clerk user ID
  text      String   // Gratitude text
  leafColor String   // Assigned leaf color
  leafX     Float    // Leaf position X
  leafY     Float    // Leaf position Y
  leafSize  Float    // Leaf size
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([createdAt])
}

model User {
  id               String            @id // Clerk user ID
  gratitudeEntries GratitudeEntry[]
  // ... other user fields
}
```

### Data Flow
1. User submits gratitude
2. Create GratitudeEntry in database
3. Assign random leaf color
4. Calculate leaf position (based on tree structure and existing leaves)
5. Store leaf metadata
6. Trigger animation
7. Render new leaf on canvas

### Loading State
- On page load, fetch all user's gratitude entries
- Reconstruct tree based on entry count
- Position all leaves based on stored metadata
- Animate tree into view (fade in + grow)

---

## 🎮 User Interactions

### Primary Interaction: Add Gratitude
1. User types in input field
2. Button enables when text is present
3. User taps "Grow My Tree"
4. Input clears and disables
5. Seed animation plays
6. New leaf appears
7. Input re-enables
8. User can add another (max 1 per day? or unlimited?)

### Secondary Interactions
- **Tap Leaf**: Show gratitude text in tooltip (optional)
- **Scroll**: View full tree if it grows beyond viewport
- **Pull to Refresh**: Gentle tree shake animation

### Constraints
- **Rate Limiting**: Consider max gratitudes per day (e.g., 5)
- **Text Length**: Max 200 characters
- **Validation**: No empty submissions

---

## ⚡ Performance Requirements

### Canvas Rendering
- **Target**: 60 FPS
- **Optimization**: RequestAnimationFrame
- **Particle Limit**: Max 50 particles at once
- **Leaf Limit**: Render only visible leaves if 500+

### Animation Performance
- **Use**: CSS transforms for simple animations
- **Use**: Canvas for complex animations
- **Avoid**: Heavy blur effects
- **Avoid**: Too many simultaneous animations

### Loading Performance
- **Initial Load**: < 2 seconds
- **Gratitude Submit**: < 500ms response
- **Tree Reconstruction**: < 1 second for 100 leaves

---

## 🚫 What NOT to Do

### Visual
- ❌ No flat vector graphics
- ❌ No cartoon style
- ❌ No gaming UI (coins, XP, levels)
- ❌ No dark mode
- ❌ No gradients (except subtle on trunk)
- ❌ No heavy shadows
- ❌ No neon colors
- ❌ No cluttered UI

### Interaction
- ❌ No gamification mechanics
- ❌ No achievements/badges
- ❌ No leaderboards
- ❌ No social sharing (initially)
- ❌ No notifications
- ❌ No ads

### Technical
- ❌ No heavy 3D libraries
- ❌ No physics engines
- ❌ No external animation libraries (use native)
- ❌ No unnecessary API calls

---

## 🎯 Success Criteria

### Visual Quality
- [ ] Tree looks organic and premium
- [ ] Animations are smooth (60 FPS)
- [ ] Colors match Zumlo brand exactly
- [ ] Scene feels alive and peaceful
- [ ] Growth progression is clear and rewarding

### User Experience
- [ ] Gratitude moment feels magical
- [ ] Input is easy and intuitive
- [ ] Tree responds to user actions
- [ ] Loading is fast
- [ ] No bugs or glitches

### Technical
- [ ] Data persists correctly
- [ ] Works on mobile (iPhone frame)
- [ ] TypeScript types are correct
- [ ] Build passes without errors
- [ ] Code is maintainable

### Emotional Impact
- [ ] Users feel rewarded for gratitude
- [ ] Tree feels personal and meaningful
- [ ] Experience is calming, not stressful
- [ ] Users want to return daily

---

## 📋 Implementation Phases

### Phase 1: Foundation (MVP)
- Basic tree structure (trunk + branches)
- Simple leaf system (circles with color)
- Input UI
- Database integration
- Basic gratitude animation (seed → leaf)

### Phase 2: Visual Polish
- Organic tree rendering
- Realistic leaf shapes
- Ground scene (flowers, grass)
- Improved animations
- Always-alive effects

### Phase 3: Growth System
- Growth stages (sapling → signature)
- Milestone animations
- Tree progression logic
- Visual feedback for milestones

### Phase 4: Premium Details
- Birds and petals
- Advanced particle effects
- Leaf interaction (tap to view)
- Performance optimization
- Edge case handling

---

## 🔗 Related Files

- **Component**: `/components/gratitude-tree.tsx` (to be created)
- **Page**: `/app/(screens)/gratitude-tree/page.tsx` (to be created)
- **Database**: `/prisma/schema.prisma` (update)
- **API**: `/app/api/gratitude/route.ts` (to be created)

---

## 📚 Reference Inspiration

- **Monument Valley**: Organic architecture, peaceful aesthetic
- **Apple Design Awards**: Premium polish, attention to detail
- **Lantern Release**: Magical moment, emotional impact
- **Firefly Catcher**: Organic movement, depth
- **Cloud Drift**: Natural elements, calming interaction

---

## ✅ Next Steps

1. Review and approve requirements
2. Create design document (tree structure, algorithms)
3. Set up database schema
4. Implement Phase 1 (MVP)
5. Iterate based on visual quality
6. Add polish and premium details

---

**Last Updated**: May 29, 2026
**Status**: Requirements Complete - Awaiting Approval
