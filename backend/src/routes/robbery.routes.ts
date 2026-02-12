import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { actionLimiter } from '../middleware/rateLimit';
import { RobberyService } from '../services/robbery.service';
import { PlayerService } from '../services/player.service';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const player = await PlayerService.getPlayer(req.playerId!);
    const robberies = await RobberyService.getAvailableRobberies(player.level);
    const allRobberies = await RobberyService.getAllRobberies();

    // Return all robberies with availability status
    const data = allRobberies.map(r => ({
      ...r,
      available: r.levelRequired <= player.level,
      locked: r.levelRequired > player.level,
    }));

    res.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

router.post('/:robberyId/attempt', actionLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const result = await RobberyService.attemptRobbery(req.playerId!, req.params.robberyId);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode || 400;
    const message = err instanceof Error ? err.message : 'Error';
    res.status(statusCode).json({ success: false, error: message });
  }
});

router.get('/history', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await RobberyService.getHistory(req.playerId!, page);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

export default router;
