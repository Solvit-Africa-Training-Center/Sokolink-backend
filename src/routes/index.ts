import { Router } from 'express';
import { userRouter } from './userRoutes';
import  { productRoutes } from './productRoutes';
import  {adminRoutes} from './adminRoutes';
import { ratingRoutes } from './RatingAndReviewRoutes';
import { wholesalerRouter } from './wholesalerRoutes';
import { retailerRouter } from './retailerRoutes';
//import { cartRoutes } from './cartRoutes';
// import { swaggerRouter } from './swaggerRoutes';
import { profileRouter } from './profileRoutes';

const routers = Router();
const allRoutes = [
  userRouter,
  productRoutes,
  adminRoutes,
  wholesalerRouter,
  retailerRouter,

  //swaggerRouter,
  profileRouter,
  ratingRoutes,
  //cartRoutes,
];

routers.use('/api', ...allRoutes);

export { routers };
