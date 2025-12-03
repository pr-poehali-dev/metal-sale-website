import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
}

interface PriceItem {
  id: number;
  name: string;
  specs: string;
  price: string;
  unit: string;
}

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    phone: '',
    email: '',
    message: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceList, setPriceList] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/922db43d-c6fa-4a86-8868-248e9c480c7d');
        const data = await response.json();
        setCategories(data.categories || []);
        setPriceList(data.priceList || []);
      } catch (error) {
        console.error('Failed to load catalog:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить каталог",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Заявка отправлена",
      description: "Мы свяжемся с вами в ближайшее время"
    });
    setFormData({ company: '', contact: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden metal-texture grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Icon name="Cog" size={48} className="text-primary animate-[spin_20s_linear_infinite]" />
            <h1 className="text-6xl font-bold text-foreground tracking-tight">МЕТАЛЛОПРОКАТ</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Поставки металлопродукции для промышленности и строительства
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
              <Icon name="Package" className="mr-2" size={20} />
              Каталог
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              <Icon name="Phone" className="mr-2" size={20} />
              Связаться
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Icon name="Layers" size={36} className="text-primary" />
              КАТАЛОГ ПРОДУКЦИИ
            </h2>
            <p className="text-muted-foreground">Широкий ассортимент металлопроката от производителей</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-12 text-muted-foreground">Загрузка каталога...</div>
            ) : categories.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-muted-foreground">Нет категорий</div>
            ) : (
              categories.map((category) => (
                <Card key={category.id} className="hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-3 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                        <Icon name={category.icon as any} size={28} className="text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Price List Section */}
      <section id="price" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Icon name="FileText" size={36} className="text-primary" />
              ПРАЙС-ЛИСТ
            </h2>
            <p className="text-muted-foreground">Актуальные цены на металлопродукцию</p>
          </div>
          <Card className="max-w-5xl mx-auto">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-semibold">Наименование</th>
                      <th className="text-left p-4 font-semibold">Характеристики</th>
                      <th className="text-right p-4 font-semibold">Цена, ₽</th>
                      <th className="text-center p-4 font-semibold">Ед. изм.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">Загрузка...</td>
                      </tr>
                    ) : priceList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">Нет данных</td>
                      </tr>
                    ) : (
                      priceList.map((item) => (
                        <tr key={item.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-medium">{item.name}</td>
                          <td className="p-4 text-muted-foreground">{item.specs}</td>
                          <td className="p-4 text-right text-primary font-semibold">{parseFloat(item.price).toLocaleString('ru-RU')}</td>
                          <td className="p-4 text-center text-muted-foreground">{item.unit}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-muted/20 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  * Цены указаны за тонну без учета НДС. Минимальная партия — 1 тонна. 
                  Доставка по городу — от 3000 ₽. Актуальность цен уточняйте у менеджера.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <Icon name="MessageSquare" size={36} className="text-primary" />
                КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ
              </h2>
              <p className="text-muted-foreground">Оставьте заявку и получите индивидуальный расчет</p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Название компании *</Label>
                      <Input 
                        id="company" 
                        required 
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="ООО «Ваша компания»"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Контактное лицо *</Label>
                      <Input 
                        id="contact" 
                        required 
                        value={formData.contact}
                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
                        placeholder="Иван Иванов"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="info@company.ru"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Интересующая продукция *</Label>
                    <Textarea 
                      id="message" 
                      required 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Укажите наименование, характеристики и объем партии..."
                      rows={5}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    <Icon name="Send" className="mr-2" size={20} />
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Factory" size={24} className="text-primary" />
            <span className="font-bold text-lg">МЕТАЛЛОПРОКАТ</span>
          </div>
          <p className="text-muted-foreground">Качественная металлопродукция для вашего бизнеса</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;