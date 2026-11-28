"use client";

import { FinanceReport } from "@/components/finance-report";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PayoutAccount } from "./payout-account";
import styles from "../lab-owner-pages.module.css";

export function SettlementsPage() {
  return <div className={styles.page}>
    <header className={styles.heading}>
      <div>
        <h1>Đối soát & công nợ</h1>
        <p>Theo dõi công nợ, hoa hồng và tài khoản nhận tiền của lab.</p>
      </div>
    </header>
    <Tabs defaultValue="lab-debt">
      <TabsList aria-label="Báo cáo đối soát">
        <TabsTrigger value="lab-debt">Công nợ</TabsTrigger>
        <TabsTrigger value="lab-commissions">Hoa hồng</TabsTrigger>
      </TabsList>
      <TabsContent value="lab-debt"><FinanceReport view="lab-debt" embedded /></TabsContent>
      <TabsContent value="lab-commissions"><FinanceReport view="lab-commissions" embedded /></TabsContent>
    </Tabs>
    <PayoutAccount />
  </div>;
}
