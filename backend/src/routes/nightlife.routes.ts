import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { actionLimiter } from '../middleware/rateLimit';
import { NightlifeService } from '../services/nightlife.service';
import { PlayerService } from '../services/player.service';
import { z } from 'zod';

const router = Router();
router.use(authMiddleware);

router.get('/drugs', async (req: AuthRequest, res: Response) => {
  try {
    const player = await PlayerService.getPlayer(req.playerId!);
    const drugs = await NightlifeService.getDrugs(player.level);
    const inventory = await PlayerService.getDrugInventory(req.playerId!);

    const data = drugs.map(drug => ({
      ...drug,
      owned: inventory.find(i => i.drugId === drug.id)?.quantity || 0,
    }));

    res.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

const useDrugSchema = z.object({ drugId: z.string(), quantity: z.number().int().min(1).max(10).default(1) });

router.post('/use-drug', actionLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { drugId, quantity } = useDrugSchema.parse(req.body);
    const result = await NightlifeService.useDrug(req.playerId!, drugId, quantity);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode || 400;
    const message = err instanceof Error ? err.message : 'Error';
    res.status(statusCode).json({ success: false, error: message });
  }
});

const buySchema = z.object({ drugId: z.string(), quantity: z.number().int().min(1).max(100).default(1) });

router.post('/buy', actionLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { drugId, quantity } = buySchema.parse(req.body);
    const result = await NightlifeService.buyDrug(req.playerId!, drugId, quantity);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode || 400;
    const message = err instanceof Error ? err.message : 'Error';
    res.status(statusCode).json({ success: false, error: message });
  }
});

router.post('/sell', actionLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { drugId, quantity } = buySchema.parse(req.body);
    const result = await NightlifeService.sellDrug(req.playerId!, drugId, quantity);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode || 400;
    const message = err instanceof Error ? err.message : 'Error';
    res.status(statusCode).json({ success: false, error: message });
  }
});

export default router;
