import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { BatchesModule } from './batches/batches.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LiveClassesModule } from './live-classes/live-classes.module';
import { PaymentsModule } from './payments/payments.module';
import { CouponsModule } from './coupons/coupons.module';
import { ReferralsModule } from './referrals/referrals.module';
import { CertificatesModule } from './certificates/certificates.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { AuditModule } from './audit/audit.module';
import { HealthModule } from './health/health.module';
import { CategoriesModule } from './categories/categories.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    CategoriesModule,
    AccountsModule,
    LessonsModule,
    BatchesModule,
    EnrollmentsModule,
    AssignmentsModule,
    SubmissionsModule,
    AttendanceModule,
    LiveClassesModule,
    PaymentsModule,
    CouponsModule,
    ReferralsModule,
    CertificatesModule,
    PortfoliosModule,
    NotificationsModule,
    AnalyticsModule,
    AiModule,
    AuditModule,
    HealthModule,
  ],
})
export class AppModule {}
