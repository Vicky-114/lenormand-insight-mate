import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ReadingRules = () => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
      <h3 className="text-lg font-semibold mb-4 text-foreground">雷诺曼占卜规则</h3>
      <ScrollArea className="h-[400px] pr-4">
        <ol className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="font-semibold text-primary shrink-0">1.</span>
            <span>雷诺曼不可以问是否问题。</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-primary shrink-0">2.</span>
            <span>雷诺曼最好不要问太久以后的问题，最近几个月的是最好最准的。</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-primary shrink-0">3.</span>
            <span>每次问题抽3张牌，把牌混合之后抽，心中默念问题，按着抽的顺序点击相对应的牌，进行解读。</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-primary shrink-0">4.</span>
            <span>所有的东西只是给一个方向性的预测，不论结局好坏请继续努力生活工作认真学习。</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-primary shrink-0">5.</span>
            <span>如果因为结果是好的而不继续做你该做的事情不会如愿。</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-primary shrink-0">6.</span>
            <span>如果结局不好但是付出努力改变会有一定的效果。</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-primary shrink-0">7.</span>
            <span className="font-medium text-foreground">尽人事听天命。</span>
          </li>
        </ol>
      </ScrollArea>
    </Card>
  );
};
