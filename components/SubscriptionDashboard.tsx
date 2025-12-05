import { useAppSelector } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, AlertTriangle, Activity } from 'lucide-react';
import ReportTypesChart from '@/components/charts/ReportTypesChart';
import AssistanceCountsChart from '@/components/charts/AssistanceCountsChart';
import SRHRCountsChart from '@/components/charts/SRHRCountsChart';
import { SubscriptionType } from '@/types/api';

interface SubscriptionDashboardProps {
  className?: string;
}

const SubscriptionDashboard = ({ className }: SubscriptionDashboardProps) => {
  const { currentSubscription } = useAppSelector((state) => state.auth);

  const getSubscriptionConfig = (subscription: SubscriptionType) => {
    switch (subscription) {
      case 'srhr':
        return {
          title: 'Sexual & Reproductive Health Dashboard',
          description: 'Maternal care, family planning, and reproductive health services',
          icon: Heart,
          color: 'text-pink-500',
          bgColor: 'bg-pink-50 dark:bg-pink-950/20',
          borderColor: 'border-pink-200 dark:border-pink-800',
          charts: [
            { component: SRHRCountsChart, title: 'SRHR Service Types' },
            { component: AssistanceCountsChart, title: 'Assistance Provided' },
          ],
          metrics: [
            { label: 'Maternal Care', value: 45, unit: 'services' },
            { label: 'Family Planning', value: 23, unit: 'consultations' },
            { label: 'Health Education', value: 12, unit: 'sessions' },
            { label: 'Emergency Cases', value: 8, unit: 'referrals' },
          ],
        };

      case 'gbv':
        return {
          title: 'Gender-Based Violence Dashboard',
          description: 'Protection, response, and support for survivors',
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-950/20',
          borderColor: 'border-red-200 dark:border-red-800',
          charts: [
            { component: ReportTypesChart, title: 'GBV Incident Types' },
            { component: AssistanceCountsChart, title: 'Support Services' },
          ],
          metrics: [
            { label: 'Safe Referrals', value: 38, unit: 'cases' },
            { label: 'Psychosocial Support', value: 29, unit: 'sessions' },
            { label: 'Legal Aid', value: 15, unit: 'provided' },
            { label: 'Shelter Access', value: 11, unit: 'placements' },
          ],
        };

      case 'All':
      default:
        return {
          title: 'Comprehensive Dashboard',
          description: 'All report types and system-wide metrics',
          icon: Activity,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-950/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          charts: [
            { component: ReportTypesChart, title: 'All Report Types' },
            { component: SRHRCountsChart, title: 'SRHR Services' },
          ],
          metrics: [
            { label: 'Total Reports', value: 156, unit: 'reports' },
            { label: 'Active Cases', value: 42, unit: 'ongoing' },
            { label: 'Resolved Today', value: 18, unit: 'completed' },
            { label: 'System Uptime', value: 99.9, unit: '%' },
          ],
        };
    }
  };

  const config = getSubscriptionConfig(currentSubscription);
  const Icon = config.icon;

  return (
    <div className={className}>
      {/* Header */}
      <Card className={`mb-6 ${config.bgColor} ${config.borderColor}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className={`h-8 w-8 ${config.color}`} />
              <div>
                <CardTitle className="text-xl">{config.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{config.description}</p>
              </div>
            </div>
            <Badge variant="outline" className={config.color}>
              {currentSubscription === 'All' ? 'All Reports' : currentSubscription} View
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {config.metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.unit}</div>
              <div className="text-sm font-medium mt-1">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {config.charts.map((chart, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{chart.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <chart.component />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionDashboard;

