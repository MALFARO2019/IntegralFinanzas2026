import { Tabs } from 'expo-router'
import { LayoutDashboard, ArrowLeftRight, CalendarDays, Wallet, Settings } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { Colors, Fonts } from '@/constants/theme'

const TAB_ITEMS = [
  { name: 'index', title: 'Inicio', Icon: LayoutDashboard },
  { name: 'transactions', title: 'Movimientos', Icon: ArrowLeftRight },
  { name: 'calendar', title: 'Calendario', Icon: CalendarDays },
  { name: 'accounts', title: 'Cuentas', Icon: Wallet },
  { name: 'settings', title: 'Ajustes', Icon: Settings },
]

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.cardBorder,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.foregroundMuted,
        tabBarLabelStyle: {
          fontSize: Fonts.sizes.xs,
          fontWeight: Fonts.weights.medium,
          marginTop: 2,
        },
      }}
      screenListeners={{
        tabPress: () => Haptics.selectionAsync(),
      }}
    >
      {TAB_ITEMS.map(({ name, title, Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                size={22}
                color={color}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
