import { AreaChart } from "../components/area-chart";
import { BarChart } from "../components/bar-chart";
import { LineChart } from "../components/line-chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle, // Sửa Cardtitle thành CardTitle
} from "../components/ui/card";
import { Users, Package, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      {" "}
      {/* Thêm container và padding */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border border-border shadow-none hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-secondary p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-foreground">3,782</div>
              <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                <span>+</span>
                <span>11.01%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-none hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-secondary p-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Courses
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-foreground">59</div>
              <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                <span>-</span>
                <span>9.05%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-none hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-secondary p-2">
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 6V18M18 12H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Revenue (VND)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-foreground">25.5M</div>
              <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                <span>-</span>
                <span>9.05%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-border shadow-none hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground">
              Revenue Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart />
          </CardContent>
        </Card>

        <Card className="border border-border shadow-none hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground">
              Users Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Card className="border border-border shadow-none hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium text-foreground">
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
