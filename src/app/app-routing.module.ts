import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/preview',
    pathMatch: 'full'
  },
  {
    path: 'preview',
    loadChildren: () => import('./pages/preview/preview.module').then( m => m.PreviewPageModule)
  },
  {
    path: 'slider',
    loadChildren: () => import('./pages/slider/slider.module').then( m => m.SliderPageModule)
  },
  {
    path: 'agree-read-data',
    loadChildren: () => import('./pages/agree-data-read/agree-data-read.module').then( m => m.AgreeReadDataPageModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'question',
    loadChildren: () => import('./pages/question/question.module').then( m => m.QuestionPageModule)
  },
  {
    path: 'web-rf',
    loadChildren: () => import('./pages/web-rf/web-rf.module').then( m => m.SliderPageModule)
  },
  {
    path: 'program-name',
    loadChildren: () => import('./pages/program-name/program-name.module').then( m => m.ProgramNamePageModule)
  },
  {
    path: 'individual-task',
    loadChildren: () => import('./pages/individual-task/individual-task.module').then( m => m.IndividualTaskPageModule)
  },
  {
    path: 'prev',
    loadChildren: () => import('./pages/prev-page/prev.module').then( m => m.PrevPageModule)
  },
  {
    path: 'group-task/:program_id',
    loadChildren: () => import('./pages/group-task/group-task.module').then( m => m.GroupTaskPageModule)
  },
  {
    path: 'food-program',
    loadChildren: () => import('./pages/food-program/food-program.module').then( m => m.FoodProgramPageModule)
  },
  {
    path: 'web-rf-created',
    loadChildren: () => import('./pages/web-rf-created/web-rf-created.module').then( m => m.WebRfCreatedPageModule)
  },
  {
    path: 'nutrition/:program_id',
    loadChildren: () => import('./pages/nutrition/nutrition.module').then( m => m.NutritionPageModule)
  },
  {
    path: 'group-leaderboard',
    loadChildren: () => import('./pages/group-leaderboard/group-leaderboard.module').then( m => m.GroupLeaderboardPageModule)
  },
  {
    path: 'individual-news',
    loadChildren: () => import('./pages/individual-news/individual-news.module').then( m => m.IndividualNewsPageModule)
  },
  {
    path: 'individual-leaderboard',
    loadChildren: () => import('./pages/individual-leaderboard/individual-leaderboard.module').then( m => m.IndividualLeaderboardPageModule)
  },
  {
    path: 'store',
    loadChildren: () => import('./pages/store/store.module').then( m => m.StorePageModule)
  },
  {
    path: 'portfolio',
    loadChildren: () => import('./pages/portfolio/portfolio.module').then( m => m.PortfolioPageModule)
  },
  {
    path: 'portfolio-2',
    loadChildren: () => import('./pages/portfolio-two/portfolio-two.module').then( m => m.PortfolioTwoPageModule)
  },
  {
    path: 'portfolio-3',
    loadChildren: () => import('./pages/portfolio-three/portfolio-three.module').then( m => m.PortfolioThreePageModule)
  },
  {
    path: 'team-news',
    loadChildren: () => import('./pages/team-news/team-news.module').then( m => m.TeamNewsPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'lesson-published/:lesson_id',
    loadChildren: () => import('./pages/lesson-published/lesson-published.module').then( m => m.LessonPublishedPageModule)
  },
  {
    path: 'lesson-form',
    loadChildren: () => import('./pages/lesson-form/lesson-form.module').then(m => m.LessonFormPageModule)
  },
  {
    path: 'team-published/:news_id',
    loadChildren: () => import('./pages/team-news-published/team-news-published.module').then( m => m.TeamNewsPublishedPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'create-program/:platform_id',
    loadChildren: () => import('./pages/create-program/create-program.module').then( m => m.CreateProgramPageModule)
  },
  {
    path: 'task',
    loadChildren: () => import('./task/task.module').then( m => m.TaskPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'platforms',
    loadChildren: () => import('./pages/platforms/platforms.module').then( m => m.PlatformsPageModule)
  },
  {
    path: 'statistic',
    loadChildren: () => import('./pages/statistic/statistic.module').then( m => m.StatisticPageModule)
  },
  {
    path: 'add-news',
    loadChildren: () => import('./pages/add-news/add-news.module').then( m => m.AddNewsPageModule)
  },
  {
    path: 'interview/:interview_id',
    loadChildren: () => import('./pages/interview/interview.module').then( m => m.InterviewPageModule)
  },
  {
    path: 'tasks/:program_id',
    loadChildren: () => import('./pages/tasks/tasks.module').then( m => m.TasksPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
