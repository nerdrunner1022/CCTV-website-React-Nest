import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { Admin } from './pages/Admin';
import { Amc } from './pages/Amc';
import { Blog, BlogPost } from './pages/Blog';
import { BookSurvey } from './pages/BookSurvey';
import { Calculator } from './pages/Calculator';
import { Contact } from './pages/Contact';
import { Faq } from './pages/Faq';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Packages } from './pages/Packages';
import { Portal } from './pages/Portal';
import { ProductDetail } from './pages/ProductDetail';
import { Products } from './pages/Products';
import { Projects } from './pages/Projects';
import { Quote } from './pages/Quote';
import { SolutionDetail, SolutionsIndex } from './pages/Solutions';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'solutions', element: <SolutionsIndex /> },
      { path: 'solutions/:slug', element: <SolutionDetail /> },
      { path: 'packages', element: <Packages /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:slug', element: <ProductDetail /> },
      { path: 'how-it-works', element: <HowItWorks /> },
      { path: 'projects', element: <Projects /> },
      { path: 'amc', element: <Amc /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'faq', element: <Faq /> },
      { path: 'contact', element: <Contact /> },
      { path: 'calculator', element: <Calculator /> },
      { path: 'book-survey', element: <BookSurvey /> },
      { path: 'quote', element: <Quote /> },
      { path: 'login', element: <Login /> },
      { path: 'portal', element: <Portal /> },
      { path: 'admin', element: <Admin /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
