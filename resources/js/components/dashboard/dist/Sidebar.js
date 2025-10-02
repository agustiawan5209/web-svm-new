"use strict";
exports.__esModule = true;
var button_1 = require("@/components/ui/button");
var scroll_area_1 = require("@/components/ui/scroll-area");
var separator_1 = require("@/components/ui/separator");
var tooltip_1 = require("@/components/ui/tooltip");
var use_mobile_1 = require("@/hooks/use-mobile");
var utils_1 = require("@/lib/utils");
var react_1 = require("@inertiajs/react");
var lucide_react_1 = require("lucide-react");
var react_2 = require("react");
var Sidebar = function (_a) {
    var className = _a.className, _b = _a.collapsed, collapsed = _b === void 0 ? false : _b, onToggleCollapse = _a.onToggleCollapse, handleSidebarIsMobile = _a.handleSidebarIsMobile;
    var _c = react_2.useState(collapsed), isCollapsed = _c[0], setIsCollapsed = _c[1];
    var activeSection = react_1.usePage().url.split('/').pop() || 'Dashboard';
    var auth = react_1.usePage().props.auth;
    // console.log('Active Section:', activeSection);
    var handleToggleCollapse = function () {
        var newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        if (onToggleCollapse) {
            onToggleCollapse();
        }
    };
    var navItems = [
        { name: 'Dashboard', icon: React.createElement(lucide_react_1.Home, { size: 20 }), href: route('dashboard'), active: 'dashboard' },
        { name: 'Kriteria', icon: React.createElement(lucide_react_1.BarChart2Icon, { size: 20 }), href: route('admin.kriteria.index'), active: 'kriterias' },
        { name: 'Data Pengguna', icon: React.createElement(lucide_react_1.Users2, { size: 20 }), href: route('admin.orangtua.index'), active: 'orangtua' },
        { name: 'Data Anak', icon: React.createElement(lucide_react_1.UserCog, { size: 20 }), href: route('balita.index'), active: 'balita' },
        { name: 'Training Data Nutrisi', icon: React.createElement(lucide_react_1.FolderClockIcon, { size: 20 }), href: route('admin.dataset.index'), active: 'dataset' },
        { name: 'Decision Tree', icon: React.createElement(lucide_react_1.GalleryHorizontal, { size: 20 }), href: route('DecisionTree.index'), active: 'decision-tree' },
        { name: 'Pemeriksaan', icon: React.createElement(lucide_react_1.Clock8, { size: 20 }), href: route('pemeriksaan.index'), active: 'pemeriksaan' },
        { name: 'Riwayat Pemeriksaan Pengguna', icon: React.createElement(lucide_react_1.FolderClockIcon, { size: 20 }), href: route('admin.riwayat.index'), active: 'riwayat-forest' },
    ];
    if (auth.role == 'super_admin') {
        navItems.push({ name: 'Label', icon: React.createElement(lucide_react_1.BarChart2Icon, { size: 20 }), href: route('admin.label.index'), active: 'label' });
        navItems.push({ name: 'Gejala', icon: React.createElement(lucide_react_1.BarChart2Icon, { size: 20 }), href: route('admin.gejala.index'), active: 'gejala' });
        navItems.push({
            name: 'Dataset Sayuran',
            icon: React.createElement(lucide_react_1.BarChart2Icon, { size: 20 }),
            href: route('admin.datasetSayuran.index'),
            active: 'dataset-sayuran'
        });
        navItems.push({ name: 'Jenis Sayuran', icon: React.createElement(lucide_react_1.LeafyGreen, { size: 20 }), href: route('admin.jenisTanaman.index'), active: 'jenis-tanaman' });
    }
    var isMobile = use_mobile_1.useIsMobile();
    return (React.createElement("div", { className: utils_1.cn('flex h-full flex-col border-r bg-sidebar transition-all duration-300', isCollapsed ? 'w-16' : 'w-64', className) },
        React.createElement("div", { className: "flex items-center justify-between p-4" },
            React.createElement("div", { className: "flex items-center space-x-2" },
                React.createElement(lucide_react_1.LucideBaby, { className: "text-background", size: 24 }),
                !isCollapsed && React.createElement("span", { className: "text-lg font-semibold text-background" }, "NutrisiAnak")),
            !isMobile ? (React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: handleToggleCollapse, className: "h-8 w-8" }, isCollapsed ? React.createElement(lucide_react_1.ChevronRight, { size: 16 }) : React.createElement(lucide_react_1.ChevronLeft, { size: 16 }))) : (React.createElement(button_1.Button, { variant: "ghost", size: "icon", onClick: handleSidebarIsMobile, className: "h-8 w-8" },
                React.createElement(lucide_react_1.X, { size: 16 })))),
        React.createElement(separator_1.Separator, null),
        React.createElement(scroll_area_1.ScrollArea, { className: "flex-1" },
            React.createElement("nav", { className: "px-2 py-4" },
                React.createElement(tooltip_1.TooltipProvider, { delayDuration: 0 },
                    React.createElement("ul", { className: "space-y-2" }, navItems.map(function (item) { return (React.createElement("li", { key: item.name },
                        React.createElement(react_1.Link, { href: item.href, className: utils_1.cn('flex items-center', item.active == activeSection ? 'text-primary' : 'text-white') },
                            React.createElement(tooltip_1.Tooltip, null,
                                React.createElement(tooltip_1.TooltipTrigger, { asChild: true },
                                    React.createElement(button_1.Button, { variant: item.active == activeSection ? 'outline' : 'ghost', className: utils_1.cn('w-full justify-start', isCollapsed ? 'px-2' : 'px-3') },
                                        React.createElement("span", { className: "flex items-center" },
                                            React.createElement("span", { className: utils_1.cn(item.active == activeSection ? 'text-primary' : 'text-white') }, item.icon),
                                            !isCollapsed && React.createElement("span", { className: "ml-3 text-left whitespace-normal" }, item.name)))),
                                isCollapsed && React.createElement(tooltip_1.TooltipContent, { side: "right" }, item.name))))); })))))));
};
exports["default"] = Sidebar;
