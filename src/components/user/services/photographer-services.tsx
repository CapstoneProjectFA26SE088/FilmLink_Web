"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineMessage } from "@/components/shared/feedback/inline-message";
import { StatePanel } from "@/components/shared/feedback/state-panel";
import {
	handoverMethodLabel,
	paymentMethodLabel,
	serviceTierLabel,
} from "@/components/shared/status/labels";
import { formatDate, formatMoney } from "@/lib/format";
import { useUserWorkspace } from "../user-workspace";
import {
	PhotographerApiError,
	errorMessage,
	isPhotographerRole,
	isSafeHttpUrl,
	photographerApi,
	type CatalogItem,
	type FilmLab,
	type FilmLabSummary,
	type FilmStock,
	type OrderPayload,
	type OrderPaymentMethod,
	type OrderQuote,
	type RollDraft,
	type ServicePackage,
} from "@/lib/photographer-api";

type Catalogs = {
	formats: CatalogItem[];
	processes: CatalogItem[];
	serviceTypes: CatalogItem[];
};

type Filters = {
	filmProcessId: string;
	filmFormatId: string;
	serviceTypeId: string;
	sort: string;
};

const NOT_PHOTOGRAPHER_TITLE = "Khu vực này chỉ dành cho tài khoản Photographer.";

const emptyRoll = (pkg: ServicePackage): RollDraft => ({
	filmStockId: null,
	filmStockNameText: "",
	filmFormatId: pkg.filmFormat.id,
	exposureCount: 36,
	shootingIso: null,
	servicePackageId: pkg.id,
	servicePackageScanOptionId: null,
	pushPullStops: 0,
});

const lowerFirst = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

export function PhotographerServices() {
	const { account, accountLoaded } = useUserWorkspace();
	const [catalogs, setCatalogs] = useState<Catalogs | null>(null);
	const cachedCatalogs = useRef<Catalogs | null>(null);
	const listVersion = useRef(0);
	const [labs, setLabs] = useState<FilmLabSummary[]>([]);
	const [page, setPage] = useState(0);
	const [hasNext, setHasNext] = useState(false);
	const [filters, setFilters] = useState<Filters>({
		filmProcessId: "",
		filmFormatId: "",
		serviceTypeId: "",
		sort: "price",
	});
	const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
	const [selected, setSelected] = useState<FilmLab | null>(null);
	const [bookingPackage, setBookingPackage] = useState<ServicePackage | null>(null);
	const [loading, setLoading] = useState(true);
	const [opening, setOpening] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);

	const load = useCallback(async () => {
		if (!accountLoaded || !isPhotographerRole(account?.role)) return;
		const version = ++listVersion.current;
		setLoading(true);
		setError(null);
		try {
			const [catalogData, result] = await Promise.all([
				cachedCatalogs.current ?? photographerApi.catalogs(),
				photographerApi.labs({
					...filters,
					page,
					size: 20,
					lat: coordinates?.lat,
					lng: coordinates?.lng,
				}),
			]);
			if (version !== listVersion.current) return;
			cachedCatalogs.current = catalogData;
			setCatalogs(catalogData);
			setLabs(result.content);
			setHasNext(result.hasNext);
		} catch (cause) {
			if (version === listVersion.current) setError(errorMessage(cause));
		} finally {
			if (version === listVersion.current) setLoading(false);
		}
	}, [account?.role, accountLoaded, coordinates, filters, page]);

	useEffect(() => {
		void load();
		return () => {
			listVersion.current += 1;
		};
	}, [load]);

	if (!accountLoaded) {
		return <StatePanel variant="loading" label="Đang tải thông tin tài khoản…" />;
	}
	if (!isPhotographerRole(account?.role)) {
		return <StatePanel variant="empty" title={NOT_PHOTOGRAPHER_TITLE} />;
	}
	if (bookingPackage && selected) {
		return (
			<Booking
				lab={selected}
				initialPackage={bookingPackage}
				phone={account?.phoneNumber}
				onBack={() => setBookingPackage(null)}
			/>
		);
	}
	if (selected) {
		return <LabDetail lab={selected} onBack={() => setSelected(null)} onBook={setBookingPackage} />;
	}

	async function openLab(id: number) {
		setOpening(id);
		setNotice(null);
		try {
			setSelected(await photographerApi.lab(id));
		} catch (cause) {
			setNotice(errorMessage(cause));
		} finally {
			setOpening(null);
		}
	}

	function updateFilter(key: keyof Filters, value: string) {
		setPage(0);
		setFilters((current) => ({ ...current, [key]: value }));
	}

	function requestLocation() {
		setNotice(null);
		if (!navigator.geolocation) {
			setNotice("Trình duyệt không hỗ trợ định vị.");
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
				setPage(0);
				setFilters((current) => ({ ...current, sort: "distance" }));
			},
			() => setNotice("Không thể lấy vị trí. Bạn vẫn có thể sắp xếp theo giá."),
		);
	}

	const hasFilters = Boolean(filters.filmProcessId || filters.filmFormatId || filters.serviceTypeId);
	const busy = loading || opening !== null;

	return (
		<section className="subpage-section film-lab-discovery">
			<p className="eyebrow photographer-eyebrow">Đặt dịch vụ · Khám phá Film Lab</p>
			<div className="subpage-title-row">
				<div>
					<h1>Tìm Film Lab phù hợp</h1>
					<p>Dữ liệu lab, gói dịch vụ và giá được tải trực tiếp từ FilmLink.</p>
				</div>
				<span className="service-total">{labs.length} lab trong trang</span>
			</div>

			<div className="lab-discovery-toolbar photographer-filter-grid">
				<Filter
					label="Quy trình"
					value={filters.filmProcessId}
					items={catalogs?.processes || []}
					onChange={(value) => updateFilter("filmProcessId", value)}
				/>
				<Filter
					label="Khổ phim"
					value={filters.filmFormatId}
					items={catalogs?.formats || []}
					onChange={(value) => updateFilter("filmFormatId", value)}
				/>
				<Filter
					label="Loại dịch vụ"
					value={filters.serviceTypeId}
					items={catalogs?.serviceTypes || []}
					onChange={(value) => updateFilter("serviceTypeId", value)}
				/>
				<label className="photographer-field">
					<span>Sắp xếp</span>
					<select value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}>
						<option value="price">Giá thấp trước</option>
						{coordinates ? <option value="distance">Gần nhất</option> : null}
					</select>
				</label>
				<Button type="button" variant="outline" onClick={requestLocation}>
					<MapPin data-icon="inline-start" /> Dùng vị trí
				</Button>
			</div>

			{notice ? (
				<InlineMessage tone="warning" className="photographer-message">
					{notice}
				</InlineMessage>
			) : null}

			<div className="photographer-list-region" aria-busy={loading}>
				{error ? (
					<StatePanel
						variant="error"
						title="Không thể tải danh sách Film Lab"
						description={error}
						onRetry={() => void load()}
					/>
				) : loading ? (
					<StatePanel variant="loading" rows={4} label="Đang tải danh sách Film Lab…" />
				) : labs.length ? (
					<div className="film-lab-grid">
						{labs.map((lab) => (
							<LabCard
								key={lab.id}
								lab={lab}
								opening={opening === lab.id}
								disabled={opening !== null}
								onOpen={() => void openLab(lab.id)}
							/>
						))}
					</div>
				) : (
					<StatePanel
						variant="empty"
						title={hasFilters ? "Không có Film Lab phù hợp" : "Chưa có Film Lab nào"}
						description={
							hasFilters
								? "Không có Film Lab phù hợp với bộ lọc hiện tại. Hãy thử bỏ bớt bộ lọc."
								: "Hiện chưa có Film Lab nào đang mở bán dịch vụ."
						}
					/>
				)}
			</div>

			<div className="photographer-pagination">
				<Button variant="outline" disabled={page === 0 || busy} onClick={() => setPage((value) => value - 1)}>
					Trang trước
				</Button>
				<span>Trang {page + 1}</span>
				<Button variant="outline" disabled={!hasNext || busy} onClick={() => setPage((value) => value + 1)}>
					Trang sau
				</Button>
			</div>
		</section>
	);
}

function LabCard({
	lab,
	opening,
	disabled,
	onOpen,
}: {
	lab: FilmLabSummary;
	opening: boolean;
	disabled: boolean;
	onOpen: () => void;
}) {
	const address = [lab.addressLine, lab.district, lab.province].filter(Boolean).join(", ");
	return (
		<article className="film-lab-card">
			<div
				className="film-lab-card__art"
				style={
					isSafeHttpUrl(lab.coverImageUrl)
						? { backgroundImage: `url(${JSON.stringify(lab.coverImageUrl)})`, backgroundSize: "cover" }
						: undefined
				}
			>
				<span className="film-lab-card__monogram" aria-hidden="true">
					{lab.labName.slice(0, 2).toUpperCase()}
				</span>
			</div>
			<div className="film-lab-card__body">
				<div className="film-lab-card__title">
					<div>
						<h2>{lab.labName}</h2>
						<span>
							<MapPin aria-hidden="true" /> {address}
						</span>
					</div>
				</div>
				<div className="film-lab-facts">
					{lab.distanceKm != null ? <span>{lab.distanceKm.toLocaleString("vi-VN")} km</span> : null}
				</div>
				<div className="film-lab-card__footer">
					<strong>
						Từ {formatMoney(lab.minPriceVnd)} <small>/ cuộn</small>
					</strong>
					<Button
						type="button"
						disabled={disabled}
						aria-label={`Xem lab ${lab.labName}`}
						onClick={onOpen}
					>
						{opening ? "Đang mở…" : "Xem lab"} <ArrowRight data-icon="inline-end" />
					</Button>
				</div>
			</div>
		</article>
	);
}

function Filter({
	label,
	value,
	items,
	onChange,
}: {
	label: string;
	value: string;
	items: CatalogItem[];
	onChange: (value: string) => void;
}) {
	return (
		<label className="photographer-field">
			<span>{label}</span>
			<select value={value} onChange={(event) => onChange(event.target.value)}>
				<option value="">Tất cả</option>
				{items.map((item) => (
					<option key={item.id} value={item.id}>
						{item.displayName}
					</option>
				))}
			</select>
		</label>
	);
}

function LabDetail({
	lab,
	onBack,
	onBook,
}: {
	lab: FilmLab;
	onBack: () => void;
	onBook: (pkg: ServicePackage) => void;
}) {
	return (
		<section className="subpage-section film-lab-detail">
			<Button variant="ghost" onClick={onBack}>
				<ArrowLeft data-icon="inline-start" /> Danh sách Film Lab
			</Button>
			<div className="film-lab-profile">
				<div className="film-lab-profile__copy">
					<p className="eyebrow photographer-eyebrow">Hồ sơ Film Lab</p>
					<h1>{lab.labName}</h1>
					<div className="film-lab-profile__facts">
						<span>
							<MapPin aria-hidden="true" />{" "}
							{[lab.addressLine, lab.district, lab.province].filter(Boolean).join(", ")}
						</span>
					</div>
					<p>{lab.description || "Lab chưa cập nhật phần giới thiệu."}</p>
				</div>
			</div>
			<div className="film-lab-package-heading">
				<div>
					<p className="eyebrow photographer-eyebrow">Gói đang cung cấp</p>
					<h2>Dịch vụ của {lab.labName}</h2>
				</div>
				<span>{lab.packages.length} gói</span>
			</div>
			{lab.packages.length === 0 ? (
				<StatePanel
					variant="empty"
					title="Chưa có gói dịch vụ"
					description="Lab hiện chưa có gói dịch vụ đang bán."
				/>
			) : (
				<div className="film-lab-package-list">
					{lab.packages.map((pkg) => (
						<article className="film-lab-package" key={pkg.id}>
							<div className="film-lab-package__icon">
								<span>{pkg.filmFormat.displayName}</span>
							</div>
							<div className="film-lab-package__main">
								<h3>{pkg.packageName}</h3>
								<p>
									{pkg.serviceType.displayName} · {pkg.filmProcess.displayName} · {pkg.turnaroundDays} ngày
								</p>
								<small>
									{pkg.scanOptions.length
										? `${pkg.scanOptions.length} lựa chọn scan`
										: "Không có tuỳ chọn scan"}{" "}
									· {pkg.pushPullAvailable ? "Có push/pull" : "Không nhận push/pull"}
								</small>
							</div>
							<div className="film-lab-package__price">
								<strong>{formatMoney(pkg.priceVnd)}</strong>
								<small>/ cuộn</small>
							</div>
							<Button aria-label={`Chọn gói ${pkg.packageName}`} onClick={() => onBook(pkg)}>
								Chọn gói
							</Button>
						</article>
					))}
				</div>
			)}
		</section>
	);
}

function Booking({
	lab,
	initialPackage,
	phone,
	onBack,
}: {
	lab: FilmLab;
	initialPackage: ServicePackage;
	phone?: string;
	onBack: () => void;
}) {
	const router = useRouter();
	const [rolls, setRolls] = useState<RollDraft[]>([emptyRoll(initialPackage)]);
	const [stockQuery, setStockQuery] = useState("");
	const [stocks, setStocks] = useState<FilmStock[]>([]);
	const [stockError, setStockError] = useState(false);
	const [handover, setHandover] = useState<"SELF_DROP_OFF" | "PICKUP">("SELF_DROP_OFF");
	const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>("PAY_AT_LAB");
	const [pickup, setPickup] = useState({
		address: "",
		district: "",
		province: "",
		phone: phone || "",
		start: "",
		end: "",
	});
	const [specialRequest, setSpecialRequest] = useState("");
	const [quote, setQuote] = useState<OrderQuote | null>(null);
	const [quotedPayload, setQuotedPayload] = useState<OrderPayload | null>(null);
	const [pending, setPending] = useState(false);
	const [createAttempted, setCreateAttempted] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const idempotencyKey = useRef(crypto.randomUUID());
	const stockRequestSequence = useRef(0);
	const quoteRequestSequence = useRef(0);
	const currentPayloadKey = useRef("");
	const createInFlight = useRef(false);

	const packages = lab.packages;
	const payload = useMemo<OrderPayload>(
		() => ({
			idempotencyKey: null,
			filmLabId: lab.id,
			serviceTier: "STANDARD",
			filmHandoverMethod: handover,
			paymentMethod,
			specialRequest: specialRequest.trim() || null,
			customerAddressLine: handover === "PICKUP" ? pickup.address.trim() || null : null,
			customerDistrict: handover === "PICKUP" ? pickup.district.trim() || null : null,
			customerProvince: handover === "PICKUP" ? pickup.province.trim() || null : null,
			customerPhone: handover === "PICKUP" ? pickup.phone.trim() || null : null,
			pickupWindowStartAt:
				handover === "PICKUP" && pickup.start ? new Date(pickup.start).toISOString() : null,
			pickupWindowEndAt: handover === "PICKUP" && pickup.end ? new Date(pickup.end).toISOString() : null,
			rolls: rolls.map((roll) => ({
				...roll,
				filmStockNameText: roll.filmStockId ? null : roll.filmStockNameText?.trim() || null,
			})),
		}),
		[handover, lab.id, paymentMethod, pickup, rolls, specialRequest],
	);
	const materialKey = JSON.stringify(payload);
	currentPayloadKey.current = materialKey;

	useEffect(() => {
		quoteRequestSequence.current += 1;
		setPending(false);
		setQuote(null);
		setQuotedPayload(null);
	}, [materialKey]);

	useEffect(() => {
		const requestNumber = ++stockRequestSequence.current;
		const timer = setTimeout(() => {
			if (!stockQuery.trim()) return;
			void photographerApi
				.filmStocks(stockQuery.trim())
				.then((results) => {
					if (requestNumber !== stockRequestSequence.current) return;
					setStockError(false);
					setStocks((current) =>
						Array.from(new Map([...current, ...results].map((stock) => [stock.id, stock])).values()),
					);
				})
				.catch(() => {
					if (requestNumber === stockRequestSequence.current) setStockError(true);
				});
		}, 250);
		return () => clearTimeout(timer);
	}, [stockQuery]);

	function changeRoll(index: number, patch: Partial<RollDraft>) {
		setRolls((current) =>
			current.map((roll, rollIndex) => (rollIndex === index ? { ...roll, ...patch } : roll)),
		);
	}

	function selectPackage(index: number, id: number) {
		const pkg = packages.find((item) => item.id === id)!;
		changeRoll(index, {
			servicePackageId: id,
			filmFormatId: pkg.filmFormat.id,
			servicePackageScanOptionId: null,
			pushPullStops: 0,
		});
	}

	function validateDraft() {
		if (rolls.length < 1 || rolls.length > 20) return "Đơn phải có từ 1 đến 20 cuộn.";
		for (const [index, roll] of payload.rolls.entries()) {
			if ((!roll.filmStockId && !roll.filmStockNameText) || (roll.filmStockId && roll.filmStockNameText)) {
				return `Cuộn ${index + 1}: chọn một dòng phim hoặc nhập tên tự do.`;
			}
			if (!Number.isInteger(roll.exposureCount) || roll.exposureCount < 1 || roll.exposureCount > 40) {
				return `Cuộn ${index + 1}: số kiểu phải từ 1 đến 40.`;
			}
			if (
				roll.shootingIso != null &&
				(!Number.isInteger(roll.shootingIso) || roll.shootingIso < 1 || roll.shootingIso > 12800)
			) {
				return `Cuộn ${index + 1}: ISO phải từ 1 đến 12.800.`;
			}
		}
		if (handover === "PICKUP") {
			if (!pickup.address.trim() || !pickup.district.trim() || !pickup.province.trim()) {
				return "Yêu cầu lấy phim tận nơi cần đủ địa chỉ, quận/huyện và tỉnh/thành.";
			}
			if (pickup.phone.trim().length < 9 || pickup.phone.trim().length > 15) {
				return "Số điện thoại nhận phim phải dài từ 9 đến 15 ký tự.";
			}
			if (!pickup.start || !pickup.end || new Date(pickup.end) <= new Date(pickup.start)) {
				return "Khung giờ lấy phim phải có giờ kết thúc sau giờ bắt đầu.";
			}
		}
		return null;
	}

	async function getQuote() {
		if (createAttempted) return;
		const invalid = validateDraft();
		if (invalid) {
			setError(invalid);
			return;
		}
		const requestPayload = structuredClone(payload);
		const requestKey = JSON.stringify(requestPayload);
		const requestNumber = ++quoteRequestSequence.current;
		setPending(true);
		setError(null);
		try {
			const result = await photographerApi.quote(requestPayload);
			if (requestNumber !== quoteRequestSequence.current || requestKey !== currentPayloadKey.current) return;
			setQuote(result);
			setQuotedPayload(requestPayload);
		} catch (cause) {
			if (requestNumber === quoteRequestSequence.current) setError(errorMessage(cause));
		} finally {
			if (requestNumber === quoteRequestSequence.current) setPending(false);
		}
	}

	async function submit() {
		if (!quotedPayload || !quote || createInFlight.current) return;
		createInFlight.current = true;
		setCreateAttempted(true);
		setPending(true);
		setError(null);
		try {
			const order = await photographerApi.createOrder({
				...quotedPayload,
				idempotencyKey: idempotencyKey.current,
			});
			router.replace(`/orders/${order.id}?created=1`);
		} catch (cause) {
			createInFlight.current = false;
			setPending(false);
			if (cause instanceof PhotographerApiError && [400, 422].includes(cause.status)) {
				setCreateAttempted(false);
				setQuote(null);
				setQuotedPayload(null);
				idempotencyKey.current = crypto.randomUUID();
				setError(`${errorMessage(cause)} Kiểm tra thông tin và lấy lại báo giá.`);
			} else {
				setError(`${errorMessage(cause)} Hãy thử lại cùng đơn để tránh tạo trùng.`);
			}
		}
	}

	const unavailableNote = [
		lowerFirst(paymentMethodLabel("COD")),
		`hạng ${lowerFirst(serviceTierLabel("EXPRESS"))}`,
		lowerFirst(handoverMethodLabel("PARCEL_SHIPPING")),
	].join(", ");

	return (
		<section className="service-booking-page">
			<Button variant="ghost" disabled={pending && createAttempted} onClick={onBack}>
				<ArrowLeft data-icon="inline-start" /> Quay lại gói dịch vụ
			</Button>
			<div className="service-booking-page-heading">
				<p className="eyebrow photographer-eyebrow">{lab.labName}</p>
				<h1>Khai báo cuộn phim</h1>
				<p>Mỗi cuộn có thể chọn gói, khổ phim, scan và push/pull riêng.</p>
			</div>
			<div className="service-booking-layout">
				<div className="service-booking-main">
					<div className="service-step-panel">
						{rolls.map((roll, index) => {
							const pkg = packages.find((item) => item.id === roll.servicePackageId) || initialPackage;
							return (
								<fieldset className="photographer-roll" disabled={createAttempted} key={index}>
									<legend>Cuộn {index + 1}</legend>
									<div className="service-order-form-grid">
										<label className="service-order-field">
											<span>Gói dịch vụ</span>
											<select
												value={roll.servicePackageId}
												onChange={(event) => selectPackage(index, Number(event.target.value))}
											>
												{packages.map((item) => (
													<option key={item.id} value={item.id}>
														{item.packageName}
													</option>
												))}
											</select>
										</label>
										<label className="service-order-field">
											<span>Tìm dòng phim</span>
											<Input
												value={stockQuery}
												onChange={(event) => setStockQuery(event.target.value)}
												placeholder="Kodak, Portra..."
											/>
										</label>
										<label className="service-order-field">
											<span>Dòng phim trong danh mục</span>
											<select
												value={roll.filmStockId || ""}
												onChange={(event) => {
													const id = Number(event.target.value) || null;
													const stock = stocks.find((item) => item.id === id);
													changeRoll(index, {
														filmStockId: id,
														filmStockNameText: id ? null : "",
														shootingIso: stock?.iso || roll.shootingIso,
													});
												}}
											>
												<option value="">Không tìm thấy — nhập tự do</option>
												{stocks.map((stock) => (
													<option key={stock.id} value={stock.id}>
														{stock.manufacturer} {stock.stockName}
													</option>
												))}
											</select>
										</label>
										{!roll.filmStockId ? (
											<label className="service-order-field">
												<span>Tên dòng phim</span>
												<Input
													maxLength={100}
													value={roll.filmStockNameText || ""}
													onChange={(event) => changeRoll(index, { filmStockNameText: event.target.value })}
												/>
											</label>
										) : null}
										<label className="service-order-field">
											<span>Số kiểu (1–40)</span>
											<Input
												type="number"
												min={1}
												max={40}
												value={roll.exposureCount}
												onChange={(event) => changeRoll(index, { exposureCount: Number(event.target.value) })}
											/>
										</label>
										<label className="service-order-field">
											<span>ISO chụp</span>
											<Input
												type="number"
												min={1}
												max={12800}
												value={roll.shootingIso || ""}
												onChange={(event) => changeRoll(index, { shootingIso: Number(event.target.value) || null })}
											/>
										</label>
										<label className="service-order-field">
											<span>Tuỳ chọn scan</span>
											<select
												value={roll.servicePackageScanOptionId || ""}
												onChange={(event) =>
													changeRoll(index, {
														servicePackageScanOptionId: Number(event.target.value) || null,
													})
												}
											>
												<option value="">Không chọn</option>
												{pkg.scanOptions.map((option) => (
													<option key={option.id} value={option.id}>
														{option.resolutionLabel} (+{formatMoney(option.priceVnd)})
													</option>
												))}
											</select>
										</label>
										<label className="service-order-field">
											<span>Push/Pull</span>
											<select
												disabled={!pkg.pushPullAvailable}
												value={roll.pushPullStops}
												onChange={(event) => changeRoll(index, { pushPullStops: Number(event.target.value) })}
											>
												{[-3, -2, -1, 0, 1, 2, 3].map((stop) => (
													<option key={stop} value={stop}>
														{stop === 0 ? "Không" : `${stop > 0 ? "+" : ""}${stop} stop`}
													</option>
												))}
											</select>
										</label>
									</div>
									{rolls.length > 1 ? (
										<Button
											variant="ghost"
											aria-label={`Xoá cuộn ${index + 1}`}
											onClick={() =>
												setRolls((current) => current.filter((_, itemIndex) => itemIndex !== index))
											}
										>
											Xoá cuộn
										</Button>
									) : null}
								</fieldset>
							);
						})}

						{stockError ? (
							<InlineMessage tone="warning" className="photographer-message">
								Không tải được danh sách dòng phim. Bạn vẫn có thể nhập tên dòng phim thủ công.
							</InlineMessage>
						) : null}

						<Button
							variant="outline"
							disabled={rolls.length >= 20 || createAttempted}
							onClick={() => setRolls((current) => [...current, emptyRoll(initialPackage)])}
						>
							Thêm cuộn ({rolls.length}/20)
						</Button>

						<hr />
						<h2 id="handover-heading">Bàn giao phim</h2>
						<div role="radiogroup" aria-labelledby="handover-heading">
							<label className="photographer-choice">
								<input
									type="radio"
									name="film-handover"
									disabled={createAttempted}
									checked={handover === "SELF_DROP_OFF"}
									onChange={() => setHandover("SELF_DROP_OFF")}
								/>{" "}
								{handoverMethodLabel("SELF_DROP_OFF")}
							</label>
							<label className="photographer-choice">
								<input
									type="radio"
									name="film-handover"
									disabled={createAttempted}
									checked={handover === "PICKUP"}
									onChange={() => setHandover("PICKUP")}
								/>{" "}
								Lab ghi nhận yêu cầu lấy tận nơi (FilmLink chưa điều phối tài xế)
							</label>
						</div>
						{handover === "PICKUP" ? (
							<fieldset disabled={createAttempted} className="service-order-form-grid photographer-fieldset">
								<Field
									label="Địa chỉ"
									value={pickup.address}
									onChange={(value) => setPickup((current) => ({ ...current, address: value }))}
								/>
								<Field
									label="Quận/huyện"
									value={pickup.district}
									onChange={(value) => setPickup((current) => ({ ...current, district: value }))}
								/>
								<Field
									label="Tỉnh/thành"
									value={pickup.province}
									onChange={(value) => setPickup((current) => ({ ...current, province: value }))}
								/>
								<Field
									label="Số điện thoại"
									value={pickup.phone}
									onChange={(value) => setPickup((current) => ({ ...current, phone: value }))}
								/>
								<Field
									label="Bắt đầu khung giờ"
									type="datetime-local"
									value={pickup.start}
									onChange={(value) => setPickup((current) => ({ ...current, start: value }))}
								/>
								<Field
									label="Kết thúc khung giờ"
									type="datetime-local"
									value={pickup.end}
									onChange={(value) => setPickup((current) => ({ ...current, end: value }))}
								/>
							</fieldset>
						) : null}

						<h2 id="payment-heading">Thanh toán</h2>
						<div role="radiogroup" aria-labelledby="payment-heading">
							<label className="photographer-choice">
								<input
									type="radio"
									name="payment-method"
									disabled={createAttempted}
									checked={paymentMethod === "PAY_AT_LAB"}
									onChange={() => setPaymentMethod("PAY_AT_LAB")}
								/>{" "}
								{paymentMethodLabel("PAY_AT_LAB")}
							</label>
							<label className="photographer-choice">
								<input
									type="radio"
									name="payment-method"
									disabled={createAttempted}
									checked={paymentMethod === "ONLINE"}
									onChange={() => setPaymentMethod("ONLINE")}
								/>{" "}
								Thanh toán trực tuyến qua VNPay
							</label>
						</div>
						{paymentMethod === "ONLINE" ? (
							<InlineMessage tone="warning" title="Thanh toán VNPay đang thử nghiệm" className="my-3">
								Đơn sẽ được tạo ở trạng thái chờ thanh toán. Hiện backend chưa gắn VNPay vào đơn (FA26-157), nên
								trang đơn sẽ hiện thông tin kiểm tra thay vì link thanh toán.
							</InlineMessage>
						) : null}

						<label className="service-order-field">
							<span>Yêu cầu đặc biệt (tối đa 500 ký tự)</span>
							<textarea
								disabled={createAttempted}
								maxLength={500}
								value={specialRequest}
								onChange={(event) => setSpecialRequest(event.target.value)}
							/>
						</label>

						<p className="marketplace-demo-note">
							Hạng {serviceTierLabel("STANDARD")} ·{" "}
							{paymentMethod === "ONLINE" ? "thanh toán trực tuyến qua VNPay" : lowerFirst(paymentMethodLabel("PAY_AT_LAB"))}. Hiện chưa
							khả dụng: {unavailableNote}.
						</p>

						{error ? (
							<InlineMessage tone="error" className="photographer-message">
								{error}
							</InlineMessage>
						) : null}

						<div className="service-step-footer">
							<Button disabled={pending || createAttempted} onClick={() => void getQuote()}>
								{pending && !createAttempted ? "Đang báo giá..." : "Lấy báo giá"}
							</Button>
							{quote ? (
								<Button disabled={pending || !quotedPayload} onClick={() => void submit()}>
									{pending ? "Đang tạo đơn..." : createAttempted ? "Thử lại cùng đơn" : "Xác nhận tạo đơn"}
								</Button>
							) : null}
						</div>
					</div>
				</div>

				<aside className="service-estimate-card" aria-label="Báo giá">
					<p className="eyebrow photographer-eyebrow">Báo giá từ FilmLink</p>
					<h2>
						<Clock3 aria-hidden="true" /> Chi phí
					</h2>
					{quote ? (
						<>
							<dl>
								{quote.rolls.map((roll) => (
									<div key={roll.rollSequence}>
										<dt>
											Cuộn {roll.rollSequence} · {roll.packageName}
										</dt>
										<dd>{formatMoney(roll.rollPriceVnd)}</dd>
									</div>
								))}
							</dl>
							<div className="service-estimate-total">
								<span>Tổng tạm tính</span>
								<strong>{formatMoney(quote.estimatedTotalVnd)}</strong>
							</div>
							<small>Dự kiến trả: {formatDate(quote.expectedReturnAt)}</small>
						</>
					) : (
						<p>Chọn “Lấy báo giá” để nhận giá và ngày dự kiến từ hệ thống.</p>
					)}
				</aside>
			</div>
		</section>
	);
}

function Field({
	label,
	value,
	onChange,
	type = "text",
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
}) {
	return (
		<label className="service-order-field">
			<span>{label}</span>
			<Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
		</label>
	);
}
